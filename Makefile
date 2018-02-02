UNAME := $(shell uname)

# these will not work correctly if the executable name
# is the same as something else installed on the system
# see https://stackoverflow.com/a/47852970/4074877
ifeq ($(UNAME), Linux)
BINARY := `stack exec -- whereis recipes | cut -d' ' -f2`
endif
ifeq ($(UNAME), Darwin)
BINARY := `stack exec -- which recipes`
endif

dist:
	mkdir -p dist/site
	mkdir dist/data
	cp $(BINARY) dist/
	cp -f site/index.html dist/site/
	cp -f site/recipes.css dist/site/
	cp -f site/recipes.js dist/site/
	cp -f vendor/latinise.min.js dist/site/
	cp -f data/recipes.yaml dist/data/

distclean:
	rm -rf dist/

run:
	cd dist ; stack exec recipes
