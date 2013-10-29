#!/usr/bin/env python

import os
import sys
import time

def debug(msg):
	f = open("debug.log", "a")
	f.write("[" + time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()) + "] "
			+ msg + "\n")
	f.close()

# Fork twice and kill the first two processes to create an orphan process which
# will get reassigned to init.
def fork_and_orphan():
	pid = os.fork()
	debug("pid: " + str(pid))
	if pid == 0:
		pid = os.fork()
		if pid == 0:
			debug("Finished")
	sys.exit(0)

if __name__ == "__main__":
	fork_and_orphan()
