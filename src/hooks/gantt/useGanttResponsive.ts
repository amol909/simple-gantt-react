import { useState, useEffect, useCallback } from "react";

interface ResponsiveConfig {
  containerWidth: number;
  containerHeight: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useGanttResponsive = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  defaultListWidth: number = 300
): [ResponsiveConfig, number, (width: number) => void] => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [listWidth, setListWidth] = useState<number>(defaultListWidth);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerWidth(width);
      setContainerHeight(height);

      // Adjust list width for mobile
      if (width < 768 && listWidth > width * 0.4) {
        setListWidth(Math.max(150, width * 0.4));
      }
    }
  }, [containerRef, listWidth]);

  useEffect(() => {
    updateDimensions();

    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateDimensions]);

  const responsiveConfig: ResponsiveConfig = {
    containerWidth,
    containerHeight,
    isMobile: containerWidth < 768,
    isTablet: containerWidth >= 768 && containerWidth < 1024,
    isDesktop: containerWidth >= 1024,
  };

  return [responsiveConfig, listWidth, setListWidth];
};
