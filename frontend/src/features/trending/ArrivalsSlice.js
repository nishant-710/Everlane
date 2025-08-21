
import React, { useEffect, useReducer } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDER_ACTIONS = {
  
  SET_CURRENT_SLIDE: 'SET_CURRENT_SLIDE',
  NEXT_SLIDE: 'NEXT_SLIDE',
  PREV_SLIDE: 'PREV_SLIDE',
  SET_AUTO_PLAY: 'SET_AUTO_PLAY',
  RESET_SLIDER: 'RESET_SLIDER'
};

const sliderActions = {
  setCurrentSlide: (slideIndex) => ({
    type: SLIDER_ACTIONS.SET_CURRENT_SLIDE,
    payload: slideIndex
  }),
  
  nextSlide: () => ({
    type: SLIDER_ACTIONS.NEXT_SLIDE
  }),
  
  prevSlide: () => ({
    type: SLIDER_ACTIONS.PREV_SLIDE
  }),
  
  setAutoPlay: (isAutoPlay) => ({
    type: SLIDER_ACTIONS.SET_AUTO_PLAY,
    payload: isAutoPlay
  }),
  
  resetSlider: () => ({
    type: SLIDER_ACTIONS.RESET_SLIDER
  })
};

const initialSliderState = {
  currentSlide: 0,
  isAutoPlay: true,
  totalSlides: 3,
  slides: [
    {
      id: 1,
      title: "New Arrivals",
      buttonText: "SHOP THE LATEST",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
      bgGradient: "from-gray-800 via-gray-700 to-gray-600",
      textShadow: "drop-shadow-lg"
    },
    {
      id: 2,
      title: "Best Sellers",
      buttonText: "SHOP YOUR FAVORITES", 
      image: "https://images.unsplash.com/photo-1494790108755-2616c9592b69?w=600&h=800&fit=crop&crop=face",
      bgGradient: "from-orange-400 via-yellow-400 to-orange-300",
      textShadow: "drop-shadow-md"
    },
    {
      id: 3,
      title: "The Holiday Outfit",
      buttonText: "SHOP OCCASION",
      image: "https://images.unsplash.com/photo-1506629905607-5b5d9e0bb43a?w=600&h=800&fit=crop&crop=face", 
      bgGradient: "from-red-600 via-red-500 to-red-400",
      textShadow: "drop-shadow-lg"
    }
  ],
  animationDuration: 700,
  autoPlayInterval: 4000
};

const sliderReducer = (state, action) => {
  switch (action.type) {
    case SLIDER_ACTIONS.SET_CURRENT_SLIDE:
      return {
        ...state,
        currentSlide: action.payload >= 0 && action.payload < state.slides.length 
          ? action.payload 
          : state.currentSlide
      };
      
    case SLIDER_ACTIONS.NEXT_SLIDE:
      return {
        ...state,
        currentSlide: (state.currentSlide + 1) % state.slides.length
      };
      
    case SLIDER_ACTIONS.PREV_SLIDE:
      return {
        ...state,
        currentSlide: state.currentSlide === 0 
          ? state.slides.length - 1 
          : state.currentSlide - 1
      };
      
    case SLIDER_ACTIONS.SET_AUTO_PLAY:
      return {
        ...state,
        isAutoPlay: typeof action.payload === 'boolean' 
          ? action.payload 
          : state.isAutoPlay
      };
      
    case SLIDER_ACTIONS.RESET_SLIDER:
      return {
        ...initialSliderState
      };
      
    default:
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
  }
};

const useSliderReducer = () => {
  const [state, dispatch] = useReducer(sliderReducer, initialSliderState);
  
  const actions = {
    setCurrentSlide: (index) => dispatch(sliderActions.setCurrentSlide(index)),
    nextSlide: () => dispatch(sliderActions.nextSlide()),
    prevSlide: () => dispatch(sliderActions.prevSlide()),
    setAutoPlay: (isAutoPlay) => dispatch(sliderActions.setAutoPlay(isAutoPlay)),
    resetSlider: () => dispatch(sliderActions.resetSlider())
  };
  
  return { state, actions, dispatch };
}

export default useSliderReducer