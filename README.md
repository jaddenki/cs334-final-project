
# [procedural leaf venation](https://leaf-psi.vercel.app)
visualize cool leaves :)


![Screenshot 2025-05-02 161429](https://github.com/user-attachments/assets/a1ecfe30-0cc5-42f0-a769-df21c17b4bd0)

![rwar]([https://res.cloudinary.com/dghjime6m/video/upload/v1747590036/2025-05-18_10-39-00_od4bz6.mp4)

- [live demo](https://leaf-psi.vercel.app/)  
- [source code on github](https://github.com/jaddenki/cs334-final-project)


this was my final project for [cs334 (computer graphics)](https://www.cs.purdue.edu/homes/aliaga/cs334-25spring/index.htm) at purdue — a simulation of how leaf veins grow, using nature-inspired algorithms to generate patterns that feel both organic and mathematical.

i've always been drawn to systems where complexity emerges from simple rules. leaf venation is one of those things that looks magical but is rooted in real biological logic — so i wanted to recreate and reimagine that process through code.

## palmate venation process

i started with the space colonization algorithm — inspired by how auxin (a plant hormone) diffuses through a leaf and guides vein growth. the basic idea is:

1. scatter attraction points across a leaf shape  
2. veins grow toward those points  
3. nearby points get absorbed  
4. new branches emerge from vein tips  
5. rinse and repeat

i used this to generate palmate veins (think: something like maple leaves), where several main veins spread from a central source. tweaking the parameters let me control density, spacing, and chaos. under the constraint of time, however, i hard coded midrib veins to force the shape of th eleaf.

## dichotomous venation process

for the dichotomous (think: gingko) leaf, i couldn't use the same system. **dichotomous venation** is where the veins split in two, then split again, in a kind of recursive rhythm. i built a separate branching model just for this, with angled splits and subtle curvature to mimic the iconic fan shape.

it was honestly kinda cursed for a while (looked like spider legs lol) but eventually it came together with the right symmetry and spacing.

## parallel venation process

this mode simulates **parallel venation**, where veins run vertically from base to tip. i modeled this by parameterizing (somewhat of) a leaf shape and generating evenly spaced vertical lines, adding gentle noise and tapering toward the edges. i added rotations just for fun, and at some point it stops becoming a leaf, but i love how peaceful and minimal it feels.

## technical stuff

the entire thing is built in p5.js. it’s CPU-driven, and while it can get heavy with lots of nodes, it holds up pretty well with optimizations like spatial partitioning and pruning.

most of the logic involves distance calculations, vector math, and iterative updates — lots of tiny decisions every frame that build the whole structure over time.

## inspirations

this project was inspired by a mix of academic research and creative coding demos that really stuck with me:

- [**jason webb**](https://medium.com/@jason.webb/space-colonization-algorithm-in-javascript-6f683b743dc5) — for his amazing writeup and implementation of the space colonization algorithm in javascript  
- [**adam runions & algorithmic botany**](https://algorithmicbotany.org/papers/colonization.egwnp2007.large.pdf) — for formalizing the algorithm and showing its biological grounding  

those papers and articles helped me understand the science behind the visual aesthetics — and gave me a foundation to break the rules in fun ways.

## challenges & learnings

- balancing natural growth with performance was tricky — especially as node counts exploded  
- i learned how spatial partitioning can drastically speed up proximity checks  
- rendering thousands of nodes without killing the browser... is an art

## future directions

- interactive mode (click to spawn veins?)  
- gpu acceleration with shaders maybe   
- more leaf types, weird hybrid growths, or procedural flowers
- growing leaf shape




![Screenshot 2025-05-02 161429](https://github.com/user-attachments/assets/a1ecfe30-0cc5-42f0-a769-df21c17b4bd0)

