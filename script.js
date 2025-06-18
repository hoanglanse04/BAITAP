document.addEventListener('DOMContentLoaded', () => {
    const chapterSelect = document.getElementById('chapter-select');
    const quizSection = document.getElementById('quiz-section');
    const chapterTitle = document.getElementById('chapter-title');
    const questionContainer = document.getElementById('question-container');
    const submitBtn = document.getElementById('submit-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const resultDiv = document.getElementById('result');

    let currentChapterIndex = 0;
    let currentQuestionIndex = 0;
    let selectedQuestions = [];
    let userAnswers = [];

    // Load chapters into the select dropdown
    function loadChapters() {
        chapterSelect.innerHTML = '<option value="">Chọn một chương</option>';
        quizData.forEach((chapterData, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = chapterData.chapter;
            chapterSelect.appendChild(option);
        });
    }

    // Load questions for the selected chapter
    function loadQuestion() {
	
	


        const chapter = quizData[currentChapterIndex];
        selectedQuestions = chapter.questions;
        userAnswers = [];

        if (currentQuestionIndex < selectedQuestions.length) {
            const questionData = selectedQuestions[currentQuestionIndex];
            chapterTitle.textContent = chapter.chapter;
            questionContainer.innerHTML = '';
            resultDiv.textContent = '';
            resultDiv.className = '';
            submitBtn.classList.add('hidden');
            nextQuestionBtn.classList.add('hidden');

            // Question text
            const questionItem = document.createElement('div');
            questionItem.classList.add('question-item');

            const questionText = document.createElement('p');
            questionText.textContent = `${currentQuestionIndex + 1}. ${questionData.question}`;
            questionItem.appendChild(questionText);

            // Hiển thị đáp án đã nhập
            const answersDiv = document.createElement('div');
            answersDiv.classList.add('user-answers', 'mb-2');
            questionItem.appendChild(answersDiv);

            // Input nhập đáp án
            const inputDiv = document.createElement('div');
            inputDiv.classList.add('input-answer', 'mb-3');

            const answerInput = document.createElement('input');
            answerInput.type = 'text';
            answerInput.autofocus = true;
            answerInput.className = 'form-control mb-2';
            answerInput.placeholder = questionData.correct.length === 1 
                ? 'Nhập đáp án đúng (chọn 1 trong các đáp án bên dưới)' 
                : `Nhập từng đáp án đúng (${questionData.correct.length} đáp án)`;
            inputDiv.appendChild(answerInput);

            // Hướng dẫn số đáp án còn lại
            const remainSpan = document.createElement('span');
            remainSpan.style.marginLeft = '8px';
            remainSpan.textContent = `Cần nhập ${questionData.correct.length} đáp án`;
            inputDiv.appendChild(remainSpan);

            questionItem.appendChild(inputDiv);
		const toggleHintBtn = document.createElement('button');
toggleHintBtn.type = 'button';
toggleHintBtn.className = 'btn btn-sm btn-secondary mb-2';
toggleHintBtn.style.marginBottom = '4px';
toggleHintBtn.textContent = 'Ẩn gợi ý';
questionItem.appendChild(toggleHintBtn);

		

            // Hiện danh sách đáp án có thể nhập (gợi ý) - mỗi dòng một đáp án
            const hintDiv = document.createElement('div');
            hintDiv.classList.add('options-hint');
            hintDiv.style.fontSize = '0.95em';
            hintDiv.style.marginTop = '8px';
            hintDiv.innerHTML = `<b>Gợi ý đáp án:</b><br>` + 
                questionData.options.map(opt => `<div style="margin-left:16px;margin-bottom:2px">• ${opt}</div>`).join('');

            questionItem.appendChild(hintDiv);

            questionContainer.appendChild(questionItem);
		
		toggleHintBtn.onclick = function() {
    if (hintDiv.style.display === 'none') {
        hintDiv.style.display = '';
        toggleHintBtn.textContent = 'Ẩn gợi ý';
    } else {
        hintDiv.style.display = 'none';
        toggleHintBtn.textContent = 'Hiện gợi ý';
    }
};
            // Focus input khi load
            setTimeout(() => answerInput.focus(), 300);

            // Hàm chuẩn hóa: loại bỏ khoảng trắng thừa, không phân biệt hoa thường
            function normalize(s) {
                return s.toLowerCase().replace(/\s+/g, ' ').trim();
            }

            // Cập nhật giao diện đáp án đã nhập và số còn lại
            function updateAnswersDiv() {
                answersDiv.innerHTML = userAnswers.length > 0 
                  ? `Đã nhập: ${userAnswers.map(ans => `<span class="user-answer" style="color:green;font-weight:500;margin-right:8px">${ans}</span>`).join(' ')}`
                  : '';
                remainSpan.textContent = `Cần nhập ${questionData.correct.length - userAnswers.length} đáp án`;
            }

            // Xử lý khi nhấn Enter để nhập đáp án
            answerInput.addEventListener('keydown', function(e){
    if (e.key === 'Enter' && answerInput.value.trim()) {
        let inputText = answerInput.value.trim();
        let inputLower = normalize(inputText);

        // So sánh với toàn bộ options để tìm đúng index thực tế
        let allOptionsNormalized = questionData.options.map(opt => normalize(opt));
        let matchedIdx = allOptionsNormalized.indexOf(inputLower);

        // Nếu index tìm được thuộc đáp án đúng và chưa nhập trùng
        if (
            matchedIdx !== -1 &&
            questionData.correct.includes(matchedIdx) &&
            !userAnswers.map(a => normalize(a)).includes(inputLower)
        ) {
            userAnswers.push(questionData.options[matchedIdx]); // Lưu chính xác đáp án gốc ở options
            updateAnswersDiv();
            answerInput.value = '';
            answerInput.placeholder = "Nhập tiếp đáp án...";
        } else {
            answerInput.value = '';
            answerInput.placeholder = 'Đáp án chưa đúng hoặc đã nhập rồi!';
            return;
        }
        // Nếu đủ đáp án thì show nút kiểm tra
        if (userAnswers.length === questionData.correct.length) {
            answerInput.disabled = true;
            submitBtn.classList.remove('hidden');
            remainSpan.textContent = 'Đã nhập đủ đáp án!';
        }
    }
});


            // Nút kiểm tra đáp án
            submitBtn.onclick = function() {
                let correctAnswers = questionData.correct.map(idx => questionData.options[idx]);
                let normalizedCorrect = correctAnswers.map(normalize);
                let normalizedUser = userAnswers.map(normalize);

                let isCorrect = normalizedUser.length === normalizedCorrect.length
                    && normalizedUser.every(ans => normalizedCorrect.includes(ans));

                if(isCorrect) {
                    resultDiv.innerHTML = 'Chính xác! 🎉';
                    resultDiv.className = 'alert alert-success text-center';
                } else {
                    resultDiv.innerHTML = 'Chưa chính xác. Đáp án đúng: ' + correctAnswers.join(', ');
                    resultDiv.className = 'alert alert-danger text-center';
                }
                submitBtn.classList.add('hidden');
                nextQuestionBtn.classList.remove('hidden');
            };

            updateAnswersDiv();

        } else {
            // End of chapter
            questionContainer.innerHTML = '<p>Bạn đã hoàn thành tất cả câu hỏi trong chương này!</p>';
            submitBtn.classList.add('hidden');
            nextQuestionBtn.classList.add('hidden');
            resultDiv.textContent = 'Chúc mừng bạn đã hoàn thành chương!';
            resultDiv.className = 'alert alert-success text-center';
        }
    }

    // Event listeners
    chapterSelect.addEventListener('change', (event) => {
        currentChapterIndex = parseInt(event.target.value);
        currentQuestionIndex = 0; // Reset question index when chapter changes
        if (!isNaN(currentChapterIndex) && currentChapterIndex >= 0) {
            quizSection.classList.remove('hidden');
            loadQuestion();
        } else {
            quizSection.classList.add('hidden');
        }
    });

    nextQuestionBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        loadQuestion();
    });

    // Initial load
    loadChapters();
});
