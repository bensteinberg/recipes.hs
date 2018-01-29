{-# LANGUAGE OverloadedStrings #-}
module Main (main) where

import Recipes (app)
import Test.Hspec
import Test.Hspec.Wai
import Test.Hspec.Wai.JSON

main :: IO ()
main = hspec spec

spec :: Spec
spec = with (return app) $ do
    describe "GET /recipes" $ do
        it "API responds with 200" $ do
            get "/recipes" `shouldRespondWith` 200
        it "index.html responds with 200" $ do
            get "/index.html" `shouldRespondWith` 200
