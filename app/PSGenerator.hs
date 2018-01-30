{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DataKinds #-}

import Language.PureScript.Bridge
import Data.Proxy
import Recipes

myTypes :: [SumType 'Haskell]
myTypes = [
    mkSumType (Proxy :: Proxy Recipe)
  , mkSumType (Proxy :: Proxy Recipes)
  , mkSumType (Proxy :: Proxy Ingredient)
  ]

main :: IO ()
main = do
  let srcPath = "ps"
  writePSTypes srcPath (buildBridge defaultBridge) myTypes
