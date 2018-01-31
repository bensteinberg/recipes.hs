dist:
	mkdir -p dist/site
	cp `stack exec -- whereis recipes | cut -d' ' -f2` dist/
	cp site/* dist/site/

distclean:
	rm -rf dist/
