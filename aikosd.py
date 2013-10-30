#!/usr/bin/env python

import os
import sys
import time

# The process ID of init
INIT_PID = 1

def debug(msg):
	f = open("debug.log", "a")
	f.write("[" + time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()) + "] "
			+ msg + "\n")
	f.close()

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
	detach_process_context()
	debug("Finished")
