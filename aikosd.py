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

# Returns whether the process is owned by init
def is_process_owned_by_init():
	return os.getppid() == INIT_PID

# Fork twice and kill the first two processes to create an orphan process which
# will get reassigned to init.
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
