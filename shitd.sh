#!/bin/bash
#
# Daemon control script
#

PROGRAM=shitd

PIDFILE="/tmp/$PROGRAM.pid"

START_CMD="node server.js"

KILLSIGNAL=SIGINT


get_pid() {
	if $(is_running); then
		cat $PIDFILE
	fi
}

is_running() {
	if test -f $PIDFILE; then
		return 0;
	else
		return 1;
	fi
}

case "$1" in
	status)
		if $(is_running); then
			echo "$PROGRAM starting/running, process $(get_pid)"
		else
			echo "$PROGRAM stop/waiting"
		fi
		;;
	start)
		if ! $(is_running); then
			echo "Starting $PROGRAM..."
			$START_CMD
		else
			echo "$PROGRAM already running! ($(get_pid))" >&2
			exit 3
		fi
		;;
	stop)
		if $(is_running); then
			echo "Stopping $PROGRAM..."
			kill -$KILLSIGNAL $(get_pid)
		else
			echo "$PROGRAM not running!" >&2
			exit 2
		fi
		;;
	restart)
		$0 stop
		$0 start
		;;
	*)
		echo "Usage: $0 {status|start|stop|restart}"
		exit 1
		;;
esac

exit $?
