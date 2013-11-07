#!/usr/bin/env python

import os
import resource
import sys
import time

# The process ID of init
INIT_PID = 1

def debug(msg):
	print "[" + time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()) + "] " + msg

# Checks whether we have root permissions, else fails noisily.
def exit_if_not_root_permissions():
	if os.geteuid() != 0:
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

if __name__ == "__main__":
	exit_if_not_root_permissions()

	# Set the working directory and root directory of the process to root
	# directory (/) so that the process does not keep any directory in use that
	# may be on a mounted file system.
	set_working_directory("/")
	set_change_root_directory("/")

	detach_process_context()
	prevent_core_dump()
	debug("Finished: " + str(os.getpid()))
