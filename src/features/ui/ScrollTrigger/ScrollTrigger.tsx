import { useEffect, useRef } from 'react';

interface ScrollTriggerProps {
	className?: string;
	onTrigger: () => void;
}

export const ScrollTrigger = ({ className, onTrigger }: ScrollTriggerProps) => {
	const triggerRef = useRef();

	useEffect(() => {
		if (triggerRef.current) {
			// add a visibility listener to the trigger
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						onTrigger();
					}
				});
			});
			observer.observe(triggerRef.current);
		}
	}, [onTrigger, triggerRef.current]);

	return <div className={className} ref={triggerRef}></div>;
};
