# Autoconf
AC_PREEQ([2.68])
AC_CONFIG_MACRO_DIR([build])
AC_CONFIG_AUX_DIR([build])

# Version
m4_define([shit_major_version], [0])
m4_define([shit_minor_version], [0])
m4_define([shit_micro_version], [2])
m4_define([shit_version],
          [shit_major_version.shit_minor_version.shit_micro_version])

AC_SUBST([SHIT_VERSION_MAJOR], [shit_major_version])
AC_SUBST([SHIT_VERSION_MINOR], [shit_minor_version])
AC_SUBST([SHIT_VERSION_MICRO], [shit_micro_version])
AC_SUBST([SHIT_VERSION], [shit_version])

AC_INIT([shit],
	[shit_version],
	[chrisc.101@gmail.com])

# Check for install
AC_PROG_INSTALL

# Check for mkdir -p
AC_PROG_MKDIR_P

# Automake
AM_INIT_AUTOMAKE([1.11 foreign -Wall -Werror -Wno-portability])
AM_SILENT_RULES([yes])

AC_OUTPUT([
	Makefile
	www/Makefile
	www/css/Makefile
])
