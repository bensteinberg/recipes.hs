dist:
	mkdir -p dist/site
	mkdir dist/data
	cp `stack exec -- whereis recipes | cut -d' ' -f2` dist/
	cp site/* dist/site/
	cp vendor/* dist/site/
	cp data/* dist/data/

distclean:
	rm -rf dist/

run:
	cd dist
	stack exec recipes
