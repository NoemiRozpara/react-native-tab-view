import * as React from 'react';
import ViewPager from '@react-native-community/viewpager';

import { PagerCommonProps, Listener } from './types';

type Props<T extends Route> = PagerCommonProps & {
  onIndexChange: (index: number) => void;
};

const UNSET = -1;

const DIRECTION_LEFT = 1;
const DIRECTION_RIGHT = -1;

class ViewPagerBackend<T extends Route> extends React.Component<Props<T>> {
  static defaultProps = {
    onSwipeStart: () => {},
    onSwipeEnd: () => {},
    onIndexChange: () => {},
    swipeEnabled: true,
  };

  // Initial index of the tabs
  private index = new Value(this.props.navigationState.index);

  // Next index of the tabs, updated for navigation from outside (tab press, state update)
  private nextIndex: Animated.Value<number> = new Value(UNSET);

  // The position value represent the position of the pager on a scale of 0 - routes.length-1
  // It is calculated based on the translate value and layout width
  // If we don't have the layout yet, we should return the current index
  private position = cond(
    this.layoutWidth,
    divide(multiply(this.progress, -1), this.layoutWidth),
    this.index
  );

  private layoutWidth = new Value(this.props.layout.width);

  // Current progress of the page (translateX value)
  private progress = new Value(
    // Initial value is based on the index and page width
    this.props.navigationState.index * this.props.layout.width * DIRECTION_RIGHT
  );

  // Listeners for the entered screen
  private enterListeners: Listener[] = [];

  private jumpToIndex = (index: number) => {
    // If the index changed, we need to trigger a tab switch
    // this.isSwipeGesture.setValue(FALSE);
    this.nextIndex.setValue(index);
  };

  private jumpTo = (key: string) => {
    const { navigationState, keyboardDismissMode, onIndexChange } = this.props;

    const index = navigationState.routes.findIndex(route => route.key === key);

    // A tab switch might occur when we're in the middle of a transition
    // In that case, the index might be same as before
    // So we conditionally make the pager to update the position
    if (navigationState.index === index) {
      this.jumpToIndex(index);
    } else {
      onIndexChange(index);

      // When the index changes, the focused input will no longer be in current tab
      // So we should dismiss the keyboard
      if (keyboardDismissMode === 'auto') {
        Keyboard.dismiss();
      }
    }
  };

  private addListener = (type: 'enter', listener: Listener) => {
    switch (type) {
      case 'enter':
        this.enterListeners.push(listener);
        break;
    }
  };

  private removeListener = (type: 'enter', listener: Listener) => {
    switch (type) {
      case 'enter': {
        const index = this.enterListeners.indexOf(listener);

        if (index > -1) {
          this.enterListeners.splice(index, 1);
        }

        break;
      }
    }
  };

  onPageScrollStateChanged = e => {
    switch (e.nativeEvent.state) {
      case 'settled':
        this.props.onSwipeEnd();
        return;
      case 'drag':
        this.props.onSwipeStart();
    }
  };

  render() {
    const {
      onSwipeStart,
      onSwipeEnd,
      keyboardDismissMode,
      swipeEnabled,
      onIndexChange,
      children,
      layout,
    } = this.props;

    return children({
      position: this.position,
      addListener: this.addListener,
      removeListener: this.removeListener,
      jumpTo: this.jumpTo,
      render: children => (
        <ViewPager
          initialPage={0}
          keyboardDismissMode={
            // ViewPager does not accept auto mode
            keyboardDismissMode === 'auto' ? 'on-drag' : keyboardDismissMode
          }
          onPageScrollStateChanged={onIndexChange}
          // onPageScroll={update position reanimated}
          onPageSelected={onIndexChange}
          onPageScrollStateChanged={this.onPageScrollStateChanged}
          scrollEnabled={swipeEnabled}
          orientation={layout.width > layout.height ? 'horizontal' : 'vertical'}
          transitionStyle="scroll"
        >
          {/* {React.Children.map(children, (child, index) =>
          React.isValidElement(child) ? (
            <>
              {React.cloneElement(child, {
                key: index,
              })}
            </>
          ) : null
        )} */}
        </ViewPager>
        // <PanGestureHandler
        //   enabled={layout.width !== 0 && swipeEnabled}
        //   onGestureEvent={this.handleGestureEvent}
        //   onHandlerStateChange={this.handleGestureEvent}
        //   activeOffsetX={[-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM]}
        //   failOffsetY={[-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM]}
        //   {...gestureHandlerProps}
        // >
        //   <Animated.View
        //     removeClippedSubviews={removeClippedSubviews}
        //     style={[
        //       styles.container,
        //       layout.width
        //         ? {
        //             width: layout.width * navigationState.routes.length,
        //             transform: [{ translateX }] as any,
        //           }
        //         : null,
        //     ]}
        //   >
        //     {children}
        //   </Animated.View>
        // </PanGestureHandler>
      ),
    });
  }
}

export default ViewPagerBackend;
