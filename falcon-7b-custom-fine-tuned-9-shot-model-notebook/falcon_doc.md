# Falcon 7 Billion Parameter Model with 8-bit Quantization: README

## Overview
This notebook demonstrates how to utilize the **Falcon 7 Billion Parameter Model** from Hugging Face Transformers. We'll load the model using 8-bit quantization, distribute it across both GPU and RAM, and provide a classifier template for inference.

## Steps

1. **Installation**:
    - Ensure you have Python installed.
    - Install the required modules using `pip install -r requirements.txt`.

2. **Model Loading**:
    - Load the Falcon 7 Billion Parameter Decoder only Model from Hugging Face Transformers developed by [tiiuae](https://huggingface.co/tiiuae/falcon-7b-instruct).
    - The model has been trained on a massive amount of text data (>=1 trillion tokens) and its architecture is highly optimized for inference.

3. **Quantization And Sharding**:
    - Quantization reduces memory and computational costs by representing weights and activations with lower-precision data types (e.g., 8-bit integers).
    - We'll use the **AWQ (Adaptive Weight Quantization)** algorithm supported by Transformers.
    - To enable quantization, install the `bitsandbytes` library and set the corresponding flags when loading the model:
        ```python
        from transformers import AutoModelForCausalLM

        model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype=torch.bfloat16,  # Use bfloat16 for faster inference
            load_in_8bit=True,  # Enable 8-bit quantization
            device_map="auto",  # Distribute across GPU and RAM
        )
        ```

4. **Classifier Template**:
    - For this project, we provide a simple classifier template for inference as we use a base model.
    - We use a single dialog based instruction during inference to get systematic output.
    - Example classifier template:
        ```python
        human: can you shedule my time from 10am thursday to 5pm wednesday.
        max: [operation:reschedule ,specific:10am thursday - 5pm wednesday]
        
        human: cancel my class from 10am monday.
        max: [operation:cancel ,specific:10am monday]
        
        human: what is my time table on 9pm tuesday?
        max: [operation:timetabel ,specific:all]
        
        human: bro i don't wanna go tomorrow 3am.
        max: [operation:cancel ,specific:3am tomorrow]
        ```

## Usage
- Load the model as described above.
- We Use this specifically to understand the timings based on the users conversation with the model.

## License
The Falcon 7 Billion Parameter Model is made available under the **Apache 2.0 license**.

Feel free to customize this README! 🚀
