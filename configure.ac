AC_PREEQ([2.65])

dnl ================================================================
dnl     Autoconf script for shit.js.
dnl
dnl To rebuild the configure script from this, execute command
dnl     autoconf
dnl in the directory containing this script.
dnl
dnl Based on the configure.ac script from pip-db, see
dnl <https://github.com/ChrisCummins/pip-db>.
dnl
dnl ================================================================


dnl ================================================================
dnl Project versions (i.e. the package version)
dnl ================================================================
m4_define([shit_major_version],[0])
m4_define([shit_minor_version],[0])
m4_define([shit_micro_version],[2])
m4_define([shit_version],[shit_major_version.shit_minor_version.shit_micro_version])


dnl ================================================================
dnl Project details (i.e. the "meta" stuff)
dnl ================================================================
m4_define([author],[chrisc.101@gmail.com])

AC_INIT([shit],[shit_version],[chrisc.101@gmail.com])
AC_CONFIG_MACRO_DIR([build])
AC_CONFIG_AUX_DIR([build])

dnl Fairly arbitrary, older versions might work too.
AM_INIT_AUTOMAKE([1.11 foreign -Wall -Werror -Wno-portability])
AM_SILENT_RULES([yes])


dnl ================================================================
dnl Export the package versioning
dnl ================================================================
AC_SUBST([SHIT_VERSION_MAJOR],[shit_major_version])
AC_SUBST([SHIT_VERSION_MINOR],[shit_minor_version])
AC_SUBST([SHIT_VERSION_MICRO],[shit_micro_version])
AC_SUBST([SHIT_VERSION],       [shit_version])


dnl ================================================================
dnl Check for dependency packages
dnl ================================================================
AC_PROG_INSTALL
AC_PROG_MKDIR_P


dnl     ============================================================
dnl     Do we have a Less CSS compiler?
dnl     ============================================================
AC_CHECK_PROG([LESSC],[lessc],[lessc])
AS_IF([test "x$LESSC" != x],
      [HAVE_LESSC=yes],
      [HAVE_LESSC=no
       AC_MSG_ERROR([Less CSS compiler not found.])])
AC_SUBST([HAVE_LESSC],[$HAVE_LESSC])
AM_CONDITIONAL([HAVE_LESSC],[test "x$HAVE_LESSC" = xyes])


dnl     ============================================================
dnl     Do we have npm?
dnl     ============================================================
AC_CHECK_PROG([NPM],[npm],[npm])
AS_IF([test "x$NPM" != x],
      [HAVE_NPM=yes],
      [HAVE_NPM=no
       AC_MSG_ERROR([Node package manager not found.])])
AC_SUBST([HAVE_NPM],[$HAVE_NPM])
AM_CONDITIONAL([HAVE_NPM],[test "x$HAVE_NPM" = xyes])


dnl     ============================================================
dnl     Do we have node?
dnl     ============================================================
AC_CHECK_PROG([NODE],[node],[node])
AS_IF([test "x$NODE" != x],
      [HAVE_NODE=yes],
      [HAVE_NODE=no
       AC_MSG_ERROR([Node.js not found.])])
AC_SUBST([HAVE_NODE],[$HAVE_NODE])
AM_CONDITIONAL([HAVE_NODE],[test "x$HAVE_NODE" = xyes])


dnl ================================================================
dnl Install node dependencies
dnl ================================================================
npm install


AC_OUTPUT([
	Makefile
	www/Makefile
	www/css/Makefile
])
