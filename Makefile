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

build: buildclean
	mkdir -p build/frontend
	mkdir build/data
	cp $(BINARY) build/
	npm run build
	cp -f frontend/index.html build/frontend/
	cp -f frontend/recipes.css build/frontend/
	cp -f data/recipes.yaml build/data/

buildclean:
	rm -rf build/

run:
	cd build ; stack exec recipes

stretch:
	docker build . -t stretchbuild
	STRETCHBINARY=`docker run stretchbuild stack exec -- whereis recipes | cut -d' ' -f2`
	docker cp `docker ps -alq`:$STRETCHBINARY recipes.stretch
