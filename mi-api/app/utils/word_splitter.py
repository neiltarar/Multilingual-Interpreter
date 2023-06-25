def add_newline_every_20_words(text):
    words = text.split()
    for i in range(20, len(words), 20):
        words.insert(i, '\n')
    new_text = ' '.join(words)
    return new_text