/**
 *  Just a bunch of keywords to let the library know what it's doing. Not much else.
 */
const glDictionary = {
    TRIANGLE_STRIP:0,
    TRIANGLES:1,
    POINT_CLOUD:2,
    LINES:3,
    ATTRIBUTE:4,
    UNIFORM:5,
    NONATTRIBUTE:6,
    ARRAYS:7,
    ELEMENTS:8,
    USES_COLOR_BUFFER:9,
    USES_TEXTURE_BUFFER:10,
    USES_NO_BUFFER:11,
    RGBA:12,
    FRIENDLY_RGBA:13,
    RGB:14,
    FRIENDLY_RGB:15,
    HEX:16, // WOAH SO COOL
    HSV:17,
    DIRECTIONAL_LIGHTING_ENABLED:18,
    USES_FRAGMENT_LIGHTING:19,
    USES_VERTEX_LIGHTING:20,
    USES_NO_LIGHTING:21
}
Object.freeze(glDictionary)