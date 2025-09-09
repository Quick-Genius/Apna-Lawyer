interface Window {
    webkitSpeechRecognition: any;
}

interface SpeechRecognitionResult {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult[];
    length: number;
}

interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
}
