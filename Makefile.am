noinst_SCRIPTS = shitd

CLEANFILES = $(noinst_SCRIPTS)

SUBDIRS = www

# Generating executables from Python scripts
%: %.sh
	$(INSTALL) --mode=755 $< $@

test:
	@for f in $(noinst_SCRIPTS); do \
		./$$f; \
	done
