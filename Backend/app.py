import torch
from transformers import BertTokenizer, BertModel
from torch import nn
from flask import Flask, request, jsonify
from flask_cors import CORS

MAX_LEN = 50
PRE_TRAINED_MODEL_NAME = 'bert-base-cased'
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

tokenizer = BertTokenizer.from_pretrained(PRE_TRAINED_MODEL_NAME)

class SentimentClassifier(nn.Module):
    def __init__(self, n_classes):
        super(SentimentClassifier, self).__init__()
        self.bert = BertModel.from_pretrained(PRE_TRAINED_MODEL_NAME)
        self.drop = nn.Dropout(p=0.3)
        self.out = nn.Linear(self.bert.config.hidden_size, n_classes)

    def forward(self, input_ids, attention_mask):
        _, pooled_output = self.bert(
            input_ids=input_ids,
            attention_mask=attention_mask,
            return_dict=False
        )
        output = self.drop(pooled_output)
        return self.out(output)
    
model = SentimentClassifier(7)
model.load_state_dict(torch.load('best_model_state.bin', map_location=device))
model = model.to(device)

def predict_sentiment(model, tokenizer, text):
    encoded_text = tokenizer.encode_plus(
        text,
        max_length=MAX_LEN,
        add_special_tokens=True,
        return_token_type_ids=False,
        pad_to_max_length=True,
        return_attention_mask=True,
        return_tensors='pt',
    )
    
    input_ids = encoded_text['input_ids'].to(device)
    attention_mask = encoded_text['attention_mask'].to(device)

    with torch.no_grad():
        outputs = model(input_ids, attention_mask)
        _, preds = torch.max(outputs, dim=1)

    sentiment_labels = [" Positive  ", " Excitement ", " Contentment ", " Joy ", " Neutral ", " Happy ", "Miscellaneous"]
    predicted_sentiment = sentiment_labels[preds.item()]
    
    return predicted_sentiment


#FOR IMAGES
from transformers import pipeline
from PIL import Image
import io

pipe = pipeline("image-classification", model="trpakov/vit-face-expression")



app = Flask(__name__)
CORS(app)

# ... (include all the necessary imports and model setup code here)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data['text']
    sentiment = predict_sentiment(model, tokenizer, text)
    return jsonify({'sentiment': sentiment})

@app.route('/analyze',methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    image_file = request.files['image']
    image = Image.open(io.BytesIO(image_file.read()))
    
    predictions = pipe(image)
    sentiment = predictions[0]['label']
    
    return jsonify({'sentiment': sentiment})


if __name__ == '__main__':
    app.run(debug=True)