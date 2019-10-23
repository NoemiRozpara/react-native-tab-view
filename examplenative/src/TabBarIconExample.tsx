import * as React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import {
  TabView,
  TabBar,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import Article from './Shared/Article';
import Chat from './Shared/Chat';
import Contacts from './Shared/Contacts';

type Route = {
  key: string;
  icon: string;
};

type State = NavigationState<Route>;

export default class TabBarIconExample extends React.Component<{}, State> {
  // eslint-disable-next-line react/sort-comp
  static title = 'Top tab bar with icons';
  static backgroundColor = '#e91e63';
  static appbarElevation = 0;

  state = {
    index: 0,
    routes: [
      {key: 'chat', icon: 'md-chatbubbles'},
      {key: 'contacts', icon: 'md-contact'},
      {key: 'article', icon: 'md-list'},
    ],
  };

  private handleIndexChange = (index: number) =>
    this.setState({
      index,
    });

  private renderIcon = () => (
    <Text>XDD</Text>
  );

  private renderTabBar = (
    props: SceneRendererProps & {navigationState: State},
  ) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        renderIcon={this.renderIcon}
        style={styles.tabbar}
      />
    );
  };

  private renderScene = SceneMap({
    chat: Chat,
    contacts: Contacts,
    article: Article,
  });

  render() {
    return (
      <TabView
        lazy
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        onIndexChange={this.handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#e91e63',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
});
