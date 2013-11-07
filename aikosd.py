#!/usr/bin/env python

import os
import resource
import sys
import time

# The process ID of init
INIT_PID = 1

# The user ID of root
ROOT_UID = 0

# Destination logfile for output
STDOUT_FILE = "/var/log/aikos"
STDERR_FILE = STDOUT_FILE

def debug(msg):
	print "[" + time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()) + "] " + msg

# Checks whether we have root permissions, else fails noisily.
def exit_if_not_root_permissions():
	if os.geteuid() != ROOT_UID:
		exit("fatal: must be ran as root!")

# Set the working directory of the process.
#
#     @param directory The working directory as a string, e.g. "/"
def set_working_directory(directory):
	try:
		os.chdir(directory)
	except Exception:
		exit("fatal: Unable to change working directory to '" + directory + "'")

# Set the change root of the process.
#
#     @param directory The change root directory as a string, e.g. "/"
def set_change_root_directory(directory):
	try:
		os.chroot(directory)
	except Exception:
		exit("fatal: Unable to change root directory to '" + directory + "'")

# Set the file creation mask (umask) of the process.
#
#     @param mask The desired process umask
def set_file_creation_mask(mask):
	try:
		os.umask(mask)
	except Exception:
		exit("fatal: Unable to change file creation mask '" + mask + "'")

# Returns the maximum number of open file descriptors of the process.
def get_max_file_descriptors():
	return resource.getrlimit(resource.RLIMIT_NOFILE)[1]

# Close all open file descriptors.
def close_all_open_files():
	try:
		maxfd = get_max_file_descriptors()
		os.closerange(0, maxfd)
	except Exception:
		exit("fatal: Unable to close all file descriptors")

# Redirect a system stream to a specified file.
#
#     @param src A standard system strem, e.g. stderr, stdout.
#     @param dest An open file object that should replace the current stream.
#                 If dest is None, the stream is redirected to /dev/null.
def redirect_stream(src, dest):
	if dest is None:
		fd = os.open(os.devnull, os.O_RDWR)
	else:
		fd = dest.fileno()
	os.dup2(fd, src.fileno())

# Disable core dumps. From Wikipedia:
#
#    Core dumps can save the context (state) of a process at a given state for
#    returning to it later. Systems can be made highly available by transferring
#    core between processors, sometimes via core dump files themselves.  Core
#    can also be dumped onto a remote host over a network (which is a security
#    risk).
def prevent_core_dump():
	resource.setrlimit(resource.RLIMIT_CORE, (0, 0))
	assert resource.getrlimit(resource.RLIMIT_CORE) == (0, 0)

# Returns whether the process is owned by init. From Wikipedia:
#
#    In a Unix environment, the parent process of a daemon is often, but not
#    always, the init process.
def is_process_owned_by_init():
	return os.getppid() == INIT_PID

# Detach the process context. From Wikipedia:
#
#    A daemon is usually created by a process forking a child process and then
#    immediately exiting, thus causing init to adopt the child process.
def detach_process_context():
	def fork_and_suicide():
		pid = os.fork()
		debug("pid: " + str(pid))
		if pid > 0:
			os._exit(0)

	fork_and_suicide()
	os.setsid()
	fork_and_suicide()
	assert is_process_owned_by_init() == True

if __name__ == "__main__":
	# We need root permissions.
	exit_if_not_root_permissions()

	# Dissociate the process from the controlling tty.
	detach_process_context()

	# Set the working directory and root directory of the process to root
	# directory (/) so that the process does not keep any directory in use that
	# may be on a mounted file system.
	set_working_directory("/")
	set_change_root_directory("/")

	# Change the umask to 0 to allow open(), creat(), et al. operating system
	# calls to provide their own permission masks and not to depend on the umask
	# of the caller.
	set_file_creation_mask(0)

	# Close all inherited files at the time of execution that are left open by
	# the parent process, including file descriptors 0, 1 and 2 (stdin, stdout,
	# stderr). Required files will be opened later.
	close_all_open_files()

	# Use a logfile as stdout and stderr.
	stdout = open(STDOUT_FILE, "a")
	stderr = open(STDERR_FILE, "a")

	redirect_stream(sys.stdout, stdout)
	redirect_stream(sys.stderr, stderr)

	# We don't want any inputs to the process.
	redirect_stream(sys.stdin, None)

	# We don't want core dumps for security reasons.
	prevent_core_dump()

	debug("Finished: " + str(os.getpid()))
