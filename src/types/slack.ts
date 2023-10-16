import { AllMiddlewareArgs, BlockButtonAction, SlackActionMiddlewareArgs, SlackEventMiddlewareArgs, SlackViewMiddlewareArgs, ViewStateValue, ViewSubmitAction } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';

export type SlackHomeOpenedEvent = SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs<StringIndexed>;

export type BlockButtonActionEvent = SlackActionMiddlewareArgs<BlockButtonAction> & AllMiddlewareArgs<StringIndexed>;

export type ViewSubmitEvent = SlackViewMiddlewareArgs<ViewSubmitAction> & AllMiddlewareArgs<StringIndexed>;

export type ViewSubmitViews = {
  [blockId: string]: {
    [actionId: string]: ViewStateValue;
  };
};
