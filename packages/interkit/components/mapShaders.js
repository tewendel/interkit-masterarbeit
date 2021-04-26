// Create the fragment shader as a multi-line string. Note the "`" character, valid only in ES6 JavaScript.
// Shaders can be defined elsewhere, or loaded from other files or from the network,
// but they must be strings when used in a TileLayer.GL.

// You need to *not* define the varyings and uniforms. L.TileLayer.GL does that for you.
// // precision highp float;
// // uniform sampler2D uTexture0;  // This contains a reference to the tile image loaded from the network
// // varying vec2 vTextureCoords;  // This is the interpolated texel coords for this fragment

let desaturateShader = `
    
    void main(void) {
    // Classic texel look-up (fetch the texture "pixel" color for this fragment)
    vec4 texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));

    float gray = (texelColour.r + texelColour.g + texelColour.b) / 3.0;
    gl_FragColor = vec4(gray * uRGB[0], gray * uRGB[1], gray * uRGB[2], texelColour.a);
  }

`

export {
  desaturateShader
}

