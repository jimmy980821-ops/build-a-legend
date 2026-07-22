"use client";

import React, { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
}

const glowColorMap={blue:{base:220,spread:200},purple:{base:280,spread:300},green:{base:120,spread:200},red:{base:0,spread:200},orange:{base:30,spread:200}};
const sizeMap={sm:"w-48 h-64",md:"w-64 h-80",lg:"w-80 h-96"};

type GlowStyle=CSSProperties&Record<`--${string}`,string|number>;

function GlowCard({children,className="",glowColor="orange",size="md",width,height,customSize=false}:GlowCardProps){
  const cardRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{const syncPointer=(event:PointerEvent)=>{if(!cardRef.current)return;cardRef.current.style.setProperty("--x",event.clientX.toFixed(2));cardRef.current.style.setProperty("--xp",(event.clientX/window.innerWidth).toFixed(2));cardRef.current.style.setProperty("--y",event.clientY.toFixed(2));cardRef.current.style.setProperty("--yp",(event.clientY/window.innerHeight).toFixed(2));};document.addEventListener("pointermove",syncPointer,{passive:true});return()=>document.removeEventListener("pointermove",syncPointer);},[]);
  const {base,spread}=glowColorMap[glowColor];
  const style:GlowStyle={"--base":base,"--spread":spread,"--radius":"18","--border":"1","--backdrop":"hsl(0 0% 8% / .82)","--backup-border":"hsl(0 0% 22% / .72)","--size":"240","--outer":"1","--border-size":"calc(var(--border) * 1px)","--spotlight-size":"calc(var(--size) * 1px)","--hue":"calc(var(--base) + (var(--xp, 0) * var(--spread)))",backgroundImage:"radial-gradient(var(--spotlight-size) var(--spotlight-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),hsl(var(--hue) 100% 60% / .09),transparent)",backgroundColor:"var(--backdrop)",backgroundAttachment:"fixed",border:"var(--border-size) solid var(--backup-border)",position:"relative",touchAction:"pan-y"};
  if(width!==undefined)style.width=typeof width==="number"?`${width}px`:width;
  if(height!==undefined)style.height=typeof height==="number"?`${height}px`:height;
  return <div ref={cardRef} data-glow style={style} className={`${customSize?"":`${sizeMap[size]} aspect-[3/4]`} rounded-2xl relative grid grid-rows-[1fr_auto] shadow-[0_1rem_2rem_-1rem_black] p-4 gap-4 backdrop-blur-[5px] ${className}`}><div data-glow aria-hidden="true"/>{children}</div>;
}

export { GlowCard };

