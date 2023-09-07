import React, { SVGProps } from 'react';

interface IconArrowLeftProps extends SVGProps<SVGSVGElement> {
	color?: string;
	size?: number;
}

export const IconArrowLeft = ({
	color = 'currentColor',
	size = 24,
	...rest
}: IconArrowLeftProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...rest}
		>
			<line x1="19" y1="12" x2="5" y2="12" />
			<polyline points="12 19 5 12 12 5" />
		</svg>
	);
};
