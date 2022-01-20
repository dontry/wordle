import React, { useContext, useEffect } from 'react';
import { queryHelpers, render as rtlRender } from '@testing-library/react'
import GameProvider from '../context/GameProvider';

function render(ui: React.ReactElement, option?: { answer?: string }) {
	const Wrapper: React.FC = ({ children }) => (<GameProvider answer={option?.answer}>{children}</GameProvider>)

	return rtlRender(ui, { wrapper: Wrapper })
}

const queryAllByClassName = queryHelpers.queryAllByAttribute.bind(null, 'class')

function getAllByClassName(container: HTMLElement, className: string) {
	const elements = container.querySelectorAll(`.${className}`)
	if (!elements.length) {
		throw queryHelpers.getElementError(
			`No elements with class ${className}`,
			container
		)
	}
	return elements;
}



export * from '@testing-library/react';
export { render, queryAllByClassName, getAllByClassName };