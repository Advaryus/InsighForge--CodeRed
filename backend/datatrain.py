import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from nltk.corpus import stopwords

# Load the dataset
data = pd.read_csv('your_dataset.csv')

# Preprocess the data
stop_words = set(stopwords.words('english'))
data['review'] = data['review'].str.lower()
data['review'] = data['review'].str.replace('[^\w\s]', '')
data['review'] = data['review'].str.split()
data['review'] = data['review'].apply(lambda x: [word for word in x if word not in stop_words])
data['review'] = data['review'].str.join(' ')

# Split the data
X_train, X_test, y_train, y_test = train_test_split(data['review'], data['label'], test_size=0.2, random_state=42)

# Feature extraction using TF-IDF
tfidf = TfidfVectorizer(max_features=5000)
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)

# Train the SVM classifier
svm = SVC(kernel='linear')
svm.fit(X_train_tfidf, y_train)

# Evaluate the model
y_pred = svm.predict(X_test_tfidf)
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f'Accuracy: {accuracy}')
print(f'Precision: {precision}')
print(f'Recall: {recall}')
print(f'F1-Score: {f1}')
