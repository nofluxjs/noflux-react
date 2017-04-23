import test from 'ava';
import React, { Component } from 'react';
import { mount } from 'enzyme';
import { connect, state } from '../../src';

test('partial connect', t => {
  state.set({
    profile: {
      name: 'ssnau',
    },
    project: {
      name: 'noflux',
    },
  });

  let profileRenderCallTimes = 0;
  @connect('profile')
  class ProfileContainer extends Component {
    render() {
      profileRenderCallTimes++;
      return (
        <div>
          Profile name is {state.get('profile.name')}
        </div>
      );
    }
  }

  let projectRenderCallTimes = 0;
  @connect('project.name')
  class ProjectContainer extends Component {
    render() {
      projectRenderCallTimes++;
      return (
        <div>
          Project name is {state.get('project.name')}
        </div>
      );
    }
  }

  let combineRenderCallTimes = 0;
  @connect(['profile', 'project.name'])
  class CombineContainer extends Component {
    render() {
      combineRenderCallTimes++;
      return (
        <div>
          Profile name is {state.get('profile.name')}
          Project name is {state.get('project.name')}
        </div>
      );
    }
  }

  class App extends Component {
    render() {
      return (
        <div>
          <ProfileContainer />
          <ProjectContainer />
          <CombineContainer />
        </div>
      );
    }
  }

  mount(<App />);
  t.is(profileRenderCallTimes, 1);
  t.is(projectRenderCallTimes, 1);
  t.is(combineRenderCallTimes, 1);

  state.set('profile.name', 'malash');
  t.is(profileRenderCallTimes, 2);
  t.is(projectRenderCallTimes, 1);
  t.is(combineRenderCallTimes, 2);

  state.set('project.name', '@noflux/react');
  t.is(profileRenderCallTimes, 2);
  t.is(projectRenderCallTimes, 2);
  t.is(combineRenderCallTimes, 3);

  state.set('project.repo', 'https://github.com/nofluxjs/react.git');
  t.is(profileRenderCallTimes, 2);
  t.is(projectRenderCallTimes, 2);
  t.is(combineRenderCallTimes, 3);
});
