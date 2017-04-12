import test from 'ava';
import React, { Component } from 'react';
import { mount } from 'enzyme';
import { connect, state } from '../../src';

test('partial connect', t => {
  state.set({
    profile: {
      name: 'Ssnau',
    },
    repo: {
      name: 'noflux',
    },
  });

  let profileRenderCallTimes = 0;
  @connect('profile')
  class ProfleContainer extends Component {
    render() {
      profileRenderCallTimes++;
      return (
        <div>
          Profile name is {state.get('profile.name')}
        </div>
      );
    }
  }

  let repoRenderCallTimes = 0;
  @connect('repo.name')
  class RepoContainer extends Component {
    render() {
      repoRenderCallTimes++;
      return (
        <div>
          Repo name is {state.get('repo.name')}
        </div>
      );
    }
  }

  class App extends Component {
    render() {
      return (
        <div>
          <ProfleContainer />
          <RepoContainer />
        </div>
      );
    }
  }

  mount(<App />);
  t.is(profileRenderCallTimes, 1);
  t.is(repoRenderCallTimes, 1);

  state.set('profile.name', 'Malash');
  t.is(profileRenderCallTimes, 2);
  t.is(repoRenderCallTimes, 1);

  state.set('repo.name', '@noflux/react');
  t.is(profileRenderCallTimes, 2);
  t.is(repoRenderCallTimes, 2);

  state.set('repo.git', 'https://github.com/nofluxjs/react.git');
  t.is(profileRenderCallTimes, 2);
  t.is(repoRenderCallTimes, 2);
});
