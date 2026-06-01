import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const AnimatedStat = ({ to, suffix = '', prefix = '' }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    useEffect(() => {
        if (inView) {
            const animation = animate(count, to, {
                duration: 2,
                ease: 'easeOut',
            });
            return animation.stop;
        }
    }, [inView, to, count]);

    return (
        <span ref={ref}>
            {prefix}
            <motion.span>{rounded}</motion.span>
            {suffix}
        </span>
    );
};

export default AnimatedStat;