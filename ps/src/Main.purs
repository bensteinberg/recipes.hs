module Main where

import Prelude hiding (append)

import Recipes

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)
-- import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, on, append, css, create, appendText, body, ready, setText, getValue)
import DOM (DOM)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Aff (launchAff)
import Data.Either (Either(..))
import Data.HTTP.Method (Method(..))
import Network.HTTP.Affjax (affjax, defaultRequest)

main = launchAff $ do
  res <- affjax $ defaultRequest { url = "/recipes", method = Left GET }
  liftEff $ log $ "GET /recipes response: " <> res.response

