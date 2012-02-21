# Open:Transformer #

Open:Transformer provides helpers for composing CSS Transforms. Like old-school OpenGL, transform's all about building matrix transforming stacks; unlike OpenGL, the API is a big text string.

## Transform Stack Macros ##

At it's most basic usage, Transformer provides programmatic constructs for building individual stack elements.

## transform_node.transform ##

Further, transformer provides a very basic `transform_node` construct for :

a. representing a matrix transformation stack or sub-stack,
a. combining a heirarchy of nodes into an aggregate transformation stack.

The transformation stack is a `transforms` property which gets concatenated on top of it's parents (unless opts flags as noParent).

## drawable_node.draw ##

For advanced cases, an object may have computationally complex elements to generate, yet these elements might not frequently be updated. A manual `draw` routine handles these cases, storing the draw stack and the output in `renderStack and the normal `transforms` properties.

# TODO #

A chaining API would be swell.
