{-# LANGUAGE DataKinds       #-}
{-# LANGUAGE TypeOperators   #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}

module Recipes
    ( startApp
    , app
    ) where

import qualified Data.Text as T
import Data.Yaml
import GHC.Generics
import Data.Aeson
import Data.Aeson.TH
import Network.Wai
import Network.Wai.Handler.Warp
import Servant
import Control.Monad.IO.Class (liftIO)

data Recipe = Recipe {
    name :: T.Text
  , source :: T.Text
  , ingredients :: [Ingredient]
} deriving (Show, Generic)

newtype Recipes = Recipes [Recipe] deriving Generic

data Ingredient = Ingredient {
    ingredient :: T.Text
  , amount :: T.Text
} deriving (Show, Generic)

instance FromJSON Recipe

instance FromJSON Ingredient

instance ToJSON Recipe

instance ToJSON Recipes

instance ToJSON Ingredient

fromMaybe :: Maybe [Recipe] -> [Recipe]
fromMaybe Nothing = []
fromMaybe (Just r) = r

type RecipeAPI = "recipes" :> Get '[JSON] Recipes

type StaticAPI = "" :> Raw

type ComboAPI = RecipeAPI :<|> Raw

api :: Proxy ComboAPI
api = Proxy

startApp :: IO ()
startApp = run 8081 app

app :: Application
app = serve api server3

server1 :: Server RecipeAPI
server1 = do
  file <- liftIO (decodeFile "data/recipes.yaml")
  return (Recipes $ fromMaybe file)

server2 :: Server StaticAPI
server2 = serveDirectoryWebApp "site"

server3 :: Server ComboAPI
server3 = server1 :<|> server2
