import { PriceChart } from "../../common/interfaces/coingecko.interface";
import {
  Network,
  Pool,
  Tick,
  Token,
} from "../../common/interfaces/uniswap.interface";
import { AppContextState } from "./appContext";

export enum AppActionType {
  RESET_TOKEN_LIST = "RESET_TOKEN_LIST",
  RESET_PAIR = "RESET_PAIR",
  TOGGLE_CURRENT_PAIR = "TOGGLE_CURRENT_PAIR",
  UPDATE_OUT_OF_RANGE_PERCENTAGE = "UPDATE_OUT_OF_RANGE_PERCENTAGE",
  UPDATE_PRICE_RANGE = "UPDATE_PRICE_RANGE",
  UPDATE_DEPOSIT_AMOUNT = "UPDATE_DEPOSIT_AMOUNT",
  UPDATE_PRICE_ASSUMPTION_VALUE = "UPDATE_PRICE_ASSUMPTION_VALUE",
}
export type AppAction =
  | {
      type: AppActionType.RESET_TOKEN_LIST;
      payload: {
        tokenList: Token[];
      };
    }
  | {
      type: AppActionType.RESET_PAIR;
      payload: {
        network: Network;
        pool: Pool;
        poolTicks: Tick[];
        token0: Token;
        token1: Token;
        token0PriceChart: PriceChart | null;
        token1PriceChart: PriceChart | null;
        volume24H: number;
      };
    }
  | { type: AppActionType.TOGGLE_CURRENT_PAIR }
  | { type: AppActionType.UPDATE_OUT_OF_RANGE_PERCENTAGE; payload: number }
  | { type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE; payload: number }
  | { type: AppActionType.UPDATE_PRICE_RANGE; payload: number[] }
  | { type: AppActionType.UPDATE_DEPOSIT_AMOUNT; payload: number };

export const appReducer = (
  state: AppContextState,
  action: AppAction
): AppContextState => {
  switch (action.type) {
    case AppActionType.UPDATE_DEPOSIT_AMOUNT: {
      return { ...state, depositAmountValue: action.payload };
    }
    case AppActionType.UPDATE_PRICE_RANGE: {
      return { ...state, priceRangeValue: action.payload };
    }
    case AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE: {
      return { ...state, priceAssumptionValue: action.payload };
    }
    case AppActionType.UPDATE_OUT_OF_RANGE_PERCENTAGE: {
      return { ...state, outOfRangePercentageValue: action.payload };
    }
    case AppActionType.RESET_TOKEN_LIST: {
      return { ...state, tokenList: action.payload.tokenList };
    }
    case AppActionType.RESET_PAIR: {
      const {
        network,
        pool,
        poolTicks,
        token0,
        token1,
        token0PriceChart,
        token1PriceChart,
        volume24H,
      } = action.payload;

      return {
        ...state,
        network,
        pool,
        poolTicks,
        token0,
        token1,
        token0PriceChart,
        token1PriceChart,
        volume24H,
        isPairToggled: false,
      };
    }
    case AppActionType.TOGGLE_CURRENT_PAIR: {
      const token0 = state.token1;
      const token1 = state.token0;
      const pool = {
        ...state.pool,
        token0Price: state.pool?.token1Price,
        token1Price: state.pool?.token0Price,
      } as Pool;
      const token0PriceChart = state.token1PriceChart;
      const token1PriceChart = state.token0PriceChart;

      return {
        ...state,
        isPairToggled: !state.isPairToggled,
        pool,
        token0,
        token1,
        token0PriceChart,
        token1PriceChart,
      };
    }
  }
};
