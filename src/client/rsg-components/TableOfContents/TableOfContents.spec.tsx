import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { shallow } from 'enzyme';
import TableOfContents from './TableOfContents';
import { TableOfContentsRenderer } from './TableOfContentsRenderer';
import Context from '../Context';

const components = [
	{
		visibleName: 'Button',
		name: 'Button',
		href: '#button',
	},
	{
		visibleName: 'Input',
		name: 'Input',
		href: '#input',
	},
	{
		visibleName: 'Textarea',
		name: 'Textarea',
		href: '#textarea',
	},
];

const sections = [
	{
		visibleName: 'Introduction',
		name: 'Introduction',
		href: '#introduction',
		content: 'intro.md',
	},
	{
		visibleName: 'Buttons',
		name: 'Buttons',
		href: '#buttons',
		components: [
			{
				visibleName: 'Button',
				name: 'Button',
				href: '#button',
			},
		],
	},
	{
		visibleName: 'Forms',
		name: 'Forms',
		href: '#forms',
		components: [
			{
				visibleName: 'Input',
				name: 'Input',
				href: '#input',
			},
			{
				visibleName: 'Textarea',
				name: 'Textarea',
				href: '#textarea',
			},
		],
	},
];

it('should filter list when search field contains a query', () => {
	const searchTerm = 'put';
	const { getByPlaceholderText, getAllByTestId, getByTestId } = render(
		<TableOfContents
			sections={[
				{
					visibleName: 'Input',
					href: '#input',
					components,
				},
			]}
			tocMode="expand"
		/>
	);
	expect(getAllByTestId('rsg-toc-link').length).toBe(3);
	fireEvent.change(getByPlaceholderText('Filter by name'), { target: { value: searchTerm } });
	expect(getAllByTestId('rsg-toc-link')).toHaveLength(1);
	expect(getByTestId('rsg-toc-link')).toHaveTextContent('Input');
});

it('should filter section names', () => {
	const searchTerm = 'frm';
	const { getByPlaceholderText, getAllByTestId, getByTestId } = render(
		<TableOfContents sections={sections} />
	);
	expect(getAllByTestId('rsg-toc-link').length).toBe(6);
	fireEvent.change(getByPlaceholderText('Filter by name'), { target: { value: searchTerm } });
	expect(getAllByTestId('rsg-toc-link')).toHaveLength(1);
	expect(getByTestId('rsg-toc-link')).toHaveTextContent('Forms');
});

it('should call a callback when input value changed', () => {
	const onSearchTermChange = jest.fn();
	const searchTerm = 'foo';
	const newSearchTerm = 'bar';
	const actual = shallow(
		<TableOfContentsRenderer
			classes={{}}
			searchTerm={searchTerm}
			onSearchTermChange={onSearchTermChange}
		>
			<div>foo</div>
		</TableOfContentsRenderer>
	);

	actual.find('input').simulate('change', {
		target: {
			value: newSearchTerm,
		},
	});

	expect(onSearchTermChange).toBeCalledWith(newSearchTerm);
});

it('should render content of subsections of a section that has no components', () => {
	const actual = shallow(
		<TableOfContents
			sections={[{ sections: [{ content: 'intro.md' }, { content: 'chapter.md' }] }]}
		/>
	);

	expect(actual.find('ComponentsList').prop('items')).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "components": Array [],
		    "content": undefined,
		    "forcedOpen": false,
		    "heading": false,
		    "initialOpen": true,
		    "sections": Array [],
		    "selected": false,
		    "shouldOpenInNewTab": false,
		  },
		  Object {
		    "components": Array [],
		    "content": undefined,
		    "forcedOpen": false,
		    "heading": false,
		    "initialOpen": true,
		    "sections": Array [],
		    "selected": false,
		    "shouldOpenInNewTab": false,
		  },
		]
	`);
});

it('should render components of a single top section as root', () => {
	const actual = shallow(<TableOfContents sections={[{ components }]} />);

	expect(actual.find('ComponentsList').prop('items')).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "components": Array [],
		    "content": undefined,
		    "forcedOpen": false,
		    "heading": false,
		    "href": "#button",
		    "initialOpen": true,
		    "name": "Button",
		    "sections": Array [],
		    "selected": false,
		    "shouldOpenInNewTab": false,
		    "visibleName": "Button",
		  },
		  Object {
		    "components": Array [],
		    "content": undefined,
		    "forcedOpen": false,
		    "heading": false,
		    "href": "#input",
		    "initialOpen": true,
		    "name": "Input",
		    "sections": Array [],
		    "selected": false,
		    "shouldOpenInNewTab": false,
		    "visibleName": "Input",
		  },
		  Object {
		    "components": Array [],
		    "content": undefined,
		    "forcedOpen": false,
		    "heading": false,
		    "href": "#textarea",
		    "initialOpen": true,
		    "name": "Textarea",
		    "sections": Array [],
		    "selected": false,
		    "shouldOpenInNewTab": false,
		    "visibleName": "Textarea",
		  },
		]
	`);
});

it('should render as the link will open in a new window only if external presents as true', () => {
	const actual = shallow(
		<TableOfContents
			sections={[
				{
					sections: [
						{ content: 'intro.md', href: 'http://example.com' },
						{ content: 'chapter.md', href: 'http://example.com', external: true },
					],
				},
			]}
		/>
	);

	expect(actual.find('ComponentsList').prop('items')).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "components": Array [],
		    "content": undefined,
		    "forcedOpen": false,
		    "heading": false,
		    "href": "http://example.com",
		    "initialOpen": true,
		    "sections": Array [],
		    "selected": false,
		    "shouldOpenInNewTab": false,
		  },
		  Object {
		    "components": Array [],
		    "content": undefined,
		    "external": true,
		    "forcedOpen": false,
		    "heading": false,
		    "href": "http://example.com",
		    "initialOpen": true,
		    "sections": Array [],
		    "selected": false,
		    "shouldOpenInNewTab": false,
		  },
		]
	`);
});

/**
 * testing this layer with no mocking makes no sense...
 */
it('should render components with useRouterLinks', () => {
	const { getAllByRole } = render(
		<TableOfContents
			useRouterLinks
			sections={[
				{
					sections: [
						{ visibleName: '1', name: 'Components', href: '#/Components', content: 'intro.md' },
						{ visibleName: '2', content: 'chapter.md', href: '#/Chap' },
					],
				},
			]}
		/>
	);

	expect((getAllByRole('link')[0] as any).href).toMatch(/\/#\/Components$/);
});

/**
 * testing this layer with no mocking makes no sense...
 * This test should not exist but for good coverage policy this is necessary
 */
it('should detect sections containing current selection when tocMode is collapse', () => {
	const context = {
		config: {
			tocMode: 'collapse',
		},
	};

	const Provider = (props: any) => <Context.Provider value={context} {...props} />;

	const { getByText } = render(
		<Provider>
			<TableOfContents
				tocMode="collapse"
				sections={[
					{
						sections: [
							{
								visibleName: '1',
								href: '#/components',
								sections: [{ visibleName: '1.1', href: '#/button' }],
							},
							{
								visibleName: '2',
								href: '#/chap',
								content: 'chapter.md',
								sections: [{ visibleName: '2.1', href: '#/chapter-1' }],
							},
							{ visibleName: '3', href: 'http://react-styleguidist.com' },
						],
					},
				]}
				loc={{ pathname: '', hash: 'button' }}
			/>
		</Provider>
	);

	expect(getByText('1.1')).not.toBeEmpty();
});
