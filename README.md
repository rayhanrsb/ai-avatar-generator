# AI Avatar Generator

This project uses [DreamBooth](https://dreambooth.github.io/) to train [Stable Diffusion](https://stablediffusionweb.com/) on a particular subject (like a person), so as to be able to generate unique, high-quality images of that subject in various settings. Just like Lensa or Avatar AI, it can be used to generate awesome avatars of yourself.

It uses [replicate](https://replicate.com/) for cost efficiency.

The current flow is as follows:

- The code in ```pages/api/training/index.ts``` takes images supplied by the user and configures training parameters for the model. It then initiates training the Stable Diffusion model.
- The code in ```pages/api/training/[id].ts``` checks that the training is complete, and if it is, it returns the id (version) of the custom trained model.
- The code in ```pages/api/predictions/index.ts``` takes the id (version) of the custom model and submits a user-supplied prompt to generate content. This allows the user to use the custom model to generate whatever content they want with their avatars.
- The code in ```pages/api/predictions/[id].ts``` fetches the generated content and delivers it to the front-end.

## Progress

The backed is complete, capable of training a custom model and obtaining custom generated content from it.

The front-end is pending.
