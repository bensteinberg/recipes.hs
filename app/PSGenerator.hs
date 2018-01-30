{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DataKinds #-}

import Language.PureScript.Bridge
import Data.Proxy
import Servant.PureScript
import Recipes

myTypes :: [SumType 'Haskell]
myTypes = [
    mkSumType (Proxy :: Proxy Recipe)
  , mkSumType (Proxy :: Proxy Recipes)
  , mkSumType (Proxy :: Proxy Ingredient)
  ]

main :: IO ()
main = do
  let srcPath = "ps/src"
  writePSTypes srcPath (buildBridge defaultBridge) myTypes
  writeAPIModule srcPath defaultBridgeProxy recipeAPI
