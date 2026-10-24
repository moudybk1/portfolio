"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useReducedMotion } from "@/components/useReducedMotion";

type Experience = {
  name: string;
  logo?: string;
  description: string;
  tags: string[];
  art: string;
  artPosition?: string;
};

export default function WorkShowcase({ projects }: { projects: Experience[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const selectors = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  // Keep the active tab visible when the tab row scrolls on narrow screens.
  useEffect(() => {
    const row = selectors.current;
    const tab = row?.children[active] as HTMLElement | undefined;
    if (!row || !tab) return;
    const left = tab.offsetLeft - (row.children[0] as HTMLElement).offsetLeft;
    const right = left + tab.offsetWidth;
    if (left < row.scrollLeft || right > row.scrollLeft + row.clientWidth) {
      row.scrollTo({ left: left - 12, behavior: reduce ? "instant" : "smooth" });
    }
  }, [active, reduce]);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { root: element, threshold: [0.55] },
    );
    element
      .querySelectorAll("[data-index]")
      .forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  function navigateTo(index: number) {
    const element = rail.current;
    if (!element) return;
    const next = Math.max(0, Math.min(projects.length - 1, index));
    const first = element.children[0] as HTMLElement;
    const card = element.children[next] as HTMLElement;
    setActive(next);
    element.scrollTo({
      left: card.offsetLeft - first.offsetLeft,
      behavior: reduce ? "instant" : "smooth",
    });
  }

  return (
    <div
      className="experience-showcase"
      role="region"
      aria-roledescription="carousel"
      aria-label="Work Experience"
    >
      <div className="experience-navigation">
        <div
          ref={selectors}
          className="experience-selectors"
          role="group"
          aria-label="Choose experience"
        >
          {projects.map((project, index) => (
            <button
              key={project.name}
              type="button"
              aria-pressed={active === index}
              onClick={() => navigateTo(index)}
            >
              {project.name}
            </button>
          ))}
        </div>
        <div className="gallery-controls">
          <button
            type="button"
            className="round-control"
            aria-label="Previous experience"
            onClick={() => navigateTo(active - 1)}
            disabled={active === 0}
          >
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="round-control"
            aria-label="Next experience"
            onClick={() => navigateTo(active + 1)}
            disabled={active === projects.length - 1}
          >
            <ArrowRight size={24} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={rail}
        className="experience-rail"
        role="group"
        tabIndex={0}
        aria-label="Experience gallery"
      >
        {projects.map((project, index) => (
          <article
            key={project.name}
            data-index={index}
            data-selected={active === index}
            className="experience-card"
          >
            <div className="experience-media">
              <Image
                src={project.art}
                alt=""
                fill
                sizes="(min-width: 1536px) 643px, (min-width: 768px) 50vw, 90vw"
                className="object-cover"
                style={{ objectPosition: project.artPosition }}
              />
            </div>
            <div className="experience-caption">
              <div className="experience-brand">
                {project.logo && (
                  <Image
                    src={project.logo}
                    alt={`${project.name} logo`}
                    width={42}
                    height={42}
                  />
                )}
                <h3>{project.name}</h3>
              </div>
              <div className="experience-description">
                <p>{project.description}</p>
                <ul
                  className="work-tags"
                  aria-label={`${project.name} specialties`}
                >
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
