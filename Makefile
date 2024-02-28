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
	cp -f frontend/pico.classless.min.css build/frontend/
	cp -f data/recipes.yaml build/data/

buildclean:
	rm -rf build/

run:
	cd build ; stack exec recipes

# unfortunately, for `docker ps -alq` to produce something useful, we have to do a `docker run` first,
# and I haven't been able to put the path in a variable that's usable later
debian_bookworm:
	docker build . -f Dockerfile.bookworm -t bookwormbuild
	path=$(shell docker run bookwormbuild:latest stack exec -- whereis recipes | cut -d' ' -f2)
	docker cp $(shell docker ps -alq):$(shell docker run bookwormbuild:latest stack exec -- whereis recipes | cut -d' ' -f2) recipes.bookworm
