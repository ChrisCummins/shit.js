LESS = styles.less
CSS = $(LESS:.less=.css)

noinst_SCRIPTS = $(CSS)

CLEANFILES = $(CSS)

%.css: %.less $(wildcard *.less)
	@echo '  LESS   $@'
	@lessc $< $@
