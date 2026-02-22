import {
	animate,
	motion,
	useInView,
	useMotionValue,
	useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface CountUpProps {
	value: number;
	duration?: number;
	formatter?: (value: number) => string;
	className?: string;
}

export function CountUp({
	value,
	duration = 1,
	formatter = (v) => v.toString(),
	className,
}: CountUpProps) {
	const count = useMotionValue(0);
	const rounded = useTransform(count, (latest) =>
		formatter(Math.round(latest)),
	);
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	useEffect(() => {
		if (isInView) {
			animate(count, value, { duration: duration });
		}
	}, [isInView, value, count, duration]);

	return (
		<motion.span ref={ref} className={className}>
			{rounded}
		</motion.span>
	);
}
