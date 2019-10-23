import * as React from 'react';
import ViewPager from '@react-native-community/viewpager';

import { PagerCommonProps } from './types';

type Props<T extends Route> = PagerCommonProps & {
  onIndexChange: (index: number) => void;
};

class ViewPagerBackend<T extends Route> extends React.Component<Props<T>> {
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
      // children,
    } = this.props;
    return (
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
        orientation="horizontal"
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
    );
  }
}

export default ViewPagerBackend;
