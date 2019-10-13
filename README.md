recipes.hs
==========

This is a simple recipe database and an exercise in Haskell. It's
primarily intended to be an ingredient lookup, an index to one or more
print or other sources, which you'd turn to for instruction if the
procedure weren't obvious or well-known.

Build and deploy
----------------

1. Install [Haskell
Stack](https://docs.haskellstack.org/en/stable/README/) and run `stack setup`
2. Clone this repo and enter the directory: `git clone https://github.com/bensteinberg/recipes.hs.git ; cd recipes.hs`
3. `stack build` to build the application
4. Make a data file in `data/recipes.yaml` -- see below.
5. `stack test` if you like
6. `make build` to prepare the application for deployment
7. After `make run`, the application should be running locally, at [http://127.0.0.1:26544/index.html](http://127.0.0.1:26544/index.html).
7. `rsync -avz build/ you@yourserver:/some/directory/`

You can run the application informally on `yourserver` with `cd
/some/directory ; ./recipes` inside tmux or screen; systemd users
might try adding something like [recipes.service](recipes.service) to
`/etc/systemd/system/`. To expose the service via an existing nginx
setup, try a stanza like

```
        location /recipes/ {
            rewrite ^/recipes/$ /index.html break;
            proxy_pass http://127.0.0.1:26544/;
            include /etc/nginx/proxy_params;
        }
 ```

Data file format
----------------

The data file, `data/recipes.yaml`, should be a series of entries like
this:

```
- ingredients:
  - amount: 0.25 oz
    ingredient: dry French vermouth
  - amount: 2 oz
    ingredient: gin
  - amount: garnish
    ingredient: lemon peel
  name: Dry Martini
  source: Ben
```

The source can be a page number, title and page number, name, URL, or
whatever you like.

Notes
-----

The tests only test that the application is running, really.
