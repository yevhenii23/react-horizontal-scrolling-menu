/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import type { Meta } from '@storybook/react';
import { createLiveEditStory } from 'storybook-addon-code-editor';
import styled from 'styled-jss';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

import { setupEditor } from '../setupEditor';
import { ScrollMenu } from '../../src/index';
import * as Lib from '../../src/index';
import {
  scrollSmokeTest,
  TestObj,
  leftArrowSelector,
  rightArrowSelector,
} from '../test';
import type { Canvas } from '../test';
import { SizeWrapper } from '../SizeWrapper';

// @ts-ignore
import ExampleRaw from './RTL.source.tsx?raw';
import Example from './RTL.source';

const meta: Meta<typeof ScrollMenu> = {
  title: 'Examples/RTL',
  component: Example,
  decorators: [
    (Story) => (
      <SizeWrapper>
        <Story />
      </SizeWrapper>
    ),
  ],
};

export default meta;

export const RTL = createLiveEditStory({
  code: ExampleRaw,
  availableImports: {
    react: React,
    'react-horizontal-scrolling-menu': Lib,
    'styled-jss': styled,
  },
  modifyEditor: setupEditor,
});

export const TestRTL = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement) as Canvas;
    const testObj = new TestObj(canvas, {
      leftArrow: rightArrowSelector,
      rightArrow: leftArrowSelector,
    });
    expect(await canvas.getByLabelText('RTL')).toBeChecked();
    await testObj.isReady();

    await scrollSmokeTest(testObj);
  },
};

// Another test to make sure it works with noPolyfill=true
export const TestNonRTL = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement) as Canvas;
    const testObj = new TestObj(canvas, {
      leftArrow: leftArrowSelector,
      rightArrow: rightArrowSelector,
    });

    await canvas.getByLabelText('RTL').click();
    expect(await canvas.getByLabelText('RTL')).not.toBeChecked();
    await testObj.isReady();

    await scrollSmokeTest(testObj);
  },
};
