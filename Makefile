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

build:
	mkdir -p build/site
	mkdir build/data
	cp $(BINARY) build/
	cp -f frontend/index.html build/site/
	npm run build
	cp -f frontend/recipes.css build/site/
	cp -f data/recipes.yaml build/data/

buildclean:
	rm -rf build/

run:
	cd build ; stack exec recipes
