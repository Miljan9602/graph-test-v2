/* eslint-disable prefer-const */
import { Pair, Token, Bundle } from '../types/schema'
import { BigDecimal, Address, BigInt } from '@graphprotocol/graph-ts/index'
import { ZERO_BD, factoryContract, ADDRESS_ZERO, ONE_BD, UNTRACKED_PAIRS } from './helpers'


const WETH_ADDRESS = '0x027d2e627209f1ceba52adc8a5afe9318459b44b'
const USDC_WETH_PAIR = '0x85cb6bfd781e1f42f4e79efb6bf1f1fefe4e9732' // created 10008355
const DAI_WETH_PAIR = '0x651e2c284d89da46f2336368065cc13789d63beb' // created block 10042267
const USDT_WETH_PAIR = '0x4caeef0ca99a611025a9a9ea2f02ece1daef9bc5' // created block 10093341


export function getEthPriceInUSD(): BigDecimal {
  // fetch eth prices for each stablecoin
  let daiPair = Pair.load(DAI_WETH_PAIR) // dai is token1
  let usdcPair = Pair.load(USDC_WETH_PAIR) // usdc is token1
  let usdtPair = Pair.load(USDT_WETH_PAIR) // usdt is token1

  // all 3 have been created
  if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
    let totalLiquidityETH = daiPair.reserve0.plus(usdcPair.reserve0).plus(usdtPair.reserve0)
    let daiWeight = daiPair.reserve0.div(totalLiquidityETH)
    let usdcWeight = usdcPair.reserve0.div(totalLiquidityETH)
    let usdtWeight = usdtPair.reserve0.div(totalLiquidityETH)

    return daiPair.token1Price
        .times(daiWeight)
        .plus(usdcPair.token1Price.times(usdcWeight))
        .plus(usdtPair.token1Price.times(usdtWeight))
    // dai and USDC have been created
  } else if (daiPair !== null && usdcPair !== null) {
    let totalLiquidityETH = daiPair.reserve0.plus(usdcPair.reserve0)
    let daiWeight = daiPair.reserve0.div(totalLiquidityETH)
    let usdcWeight = usdcPair.reserve0.div(totalLiquidityETH)
    return daiPair.token1Price.times(daiWeight).plus(usdcPair.token1Price.times(usdcWeight))
    // USDC is the only pair so far
  } else if (usdcPair !== null) {
    return usdcPair.token1Price
  } else if (usdtPair !== null) {
    return usdtPair.token1Price
  } else {
    return ZERO_BD
  }
}

// Original setup.
// export function getEthPriceInUSD(): BigDecimal {
//   // fetch eth prices for each stablecoin
//   let daiPair = Pair.load(DAI_WETH_PAIR) // dai is token0
//   let usdcPair = Pair.load(USDC_WETH_PAIR) // usdc is token0
//   let usdtPair = Pair.load(USDT_WETH_PAIR) // usdt is token1
//
//   // all 3 have been created
//   if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
//     let totalLiquidityETH = daiPair.reserve1.plus(usdcPair.reserve1).plus(usdtPair.reserve0)
//     let daiWeight = daiPair.reserve1.div(totalLiquidityETH)
//     let usdcWeight = usdcPair.reserve1.div(totalLiquidityETH)
//     let usdtWeight = usdtPair.reserve0.div(totalLiquidityETH)
//     return daiPair.token0Price
//       .times(daiWeight)
//       .plus(usdcPair.token0Price.times(usdcWeight))
//       .plus(usdtPair.token1Price.times(usdtWeight))
//     // dai and USDC have been created
//   } else if (daiPair !== null && usdcPair !== null) {
//     let totalLiquidityETH = daiPair.reserve1.plus(usdcPair.reserve1)
//     let daiWeight = daiPair.reserve1.div(totalLiquidityETH)
//     let usdcWeight = usdcPair.reserve1.div(totalLiquidityETH)
//     return daiPair.token0Price.times(daiWeight).plus(usdcPair.token0Price.times(usdcWeight))
//     // USDC is the only pair so far
//   } else if (usdcPair !== null) {
//     return usdcPair.token0Price
//   } else {
//     return ZERO_BD
//   }
// }

// token where amounts should contribute to tracked volume and liquidity
let WHITELIST: string[] = [

    '0x027d2e627209f1ceba52adc8a5afe9318459b44b', // wsei
  '0xf983afa393199d6902a1dd04f8e93465915ffd8b', // usdt
  '0xce15c17281e6b64b571c06cbb83c68c3b97da275', // glo
  '0x4b12b83eb77b52ff5a082ac8e2900fcd9b870d3c', // seilor
  '0x3fd40cfe4b8a1d748cad33db408b49579c6b4ca5', // pyth
  '0xace5f7ea93439af39b46d2748fa1ac19951c8d7c', // usdc
  '0x7b75109369acb528d9fa989e227812a6589712b9', // dswap
  '0xebde45a4db821c0174936e53f77e6b8805e9e2eb', // xava
  '0x6ffd84537040569bb8160d1e06d0a5d4cefdf638', // dai
  '0xe3502396dcb2d6f5da6b4e217fc1c349070daccd', // arbor
  '0xe694b0c88429cbc177143987d7c7d59b6b6741d7', // tkn


  // '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
  // '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
  // '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  // '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  // '0x0000000000085d4780b73119b644ae5ecd22b376', // TUSD
  // '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', // cDAI
  // '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
  // '0x86fadb80d8d2cff3c3680819e4da99c10232ba0f', // EBASE
  // '0x57ab1ec28d129707052df4df418d58a2d46d5f51', // sUSD
  // '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', // MKR
  // '0xc00e94cb662c3520282e6f5717214004a7f26888', // COMP
  // '0x514910771af9ca656af840dff83e8264ecf986ca', //LINK
  // '0x960b236a07cf122663c4303350609a66a7b288c0', //ANT
  // '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', //SNX
  // '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e', //YFI
  // '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', // yCurv
  // '0x853d955acef822db058eb8505911ed77f175b99e', // FRAX
  // '0xa47c8bf37f92abed4a126bda807a7b7498661acd', // WUST
  // '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI
  // '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
  // '0x956f47f50a910163d8bf957cf5846d573e7f87ca' // FEI
]

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('4000')

// minimum liquidity for price to get tracked
let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('1')

/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export function findEthPerToken(token: Token): BigDecimal {
  if (token.id == WETH_ADDRESS) {
    return ONE_BD
  }
  // loop through whitelist and check if paired with any
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i]))
    if (pairAddress.toHexString() != ADDRESS_ZERO) {
      let pair = Pair.load(pairAddress.toHexString())
      if (pair.token0 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
        let token1 = Token.load(pair.token1)
        return pair.token1Price.times(token1.derivedETH as BigDecimal) // return token1 per our token * Eth per token 1
      }
      if (pair.token1 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
        let token0 = Token.load(pair.token0)
        return pair.token0Price.times(token0.derivedETH as BigDecimal) // return token0 per our token * ETH per token 0
      }
    }
  }
  return ZERO_BD // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token,
  pair: Pair
): BigDecimal {
  let bundle = Bundle.load('1')
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // dont count tracked volume on these pairs - usually rebass tokens
  if (UNTRACKED_PAIRS.includes(pair.id)) {
    return ZERO_BD
  }

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  if (pair.liquidityProviderCount.lt(BigInt.fromI32(5))) {
    let reserve0USD = pair.reserve0.times(price0)
    let reserve1USD = pair.reserve1.times(price1)
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      if (reserve0USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve1USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
  }

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0
      .times(price0)
      .plus(tokenAmount1.times(price1))
      .div(BigDecimal.fromString('2'))
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0)
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1)
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let bundle = Bundle.load('1')
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1))
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}
