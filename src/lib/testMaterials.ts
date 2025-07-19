// Authentic IELTS test materials

export const writingTasks = {
  task1: [
    {
      id: 'task1-1',
      title: 'Population Growth Chart',
      prompt: `The chart below shows the population growth in four different countries between 1950 and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
      imageDescription: 'Line chart showing population growth trends for USA, China, India, and Brazil from 1950-2020',
      timeLimit: 20,
      wordLimit: 150
    },
    {
      id: 'task1-2', 
      title: 'University Spending',
      prompt: `The pie charts below show the percentage of university spending on different categories in 2010 and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
      imageDescription: 'Two pie charts comparing university spending categories between 2010 and 2020',
      timeLimit: 20,
      wordLimit: 150
    },
    {
      id: 'task1-3',
      title: 'Transport Usage Process',
      prompt: `The diagram below shows the process of how public transport usage has changed in a city over the past decade.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
      imageDescription: 'Flow diagram showing changes in public transport usage patterns',
      timeLimit: 20,
      wordLimit: 150
    }
  ],
  task2: [
    {
      id: 'task2-1',
      title: 'Education vs Work Experience',
      prompt: `Some people believe that studying at university or college is the best route to a successful career, while others believe that it is better to get a job straight after school.

Discuss both views and give your opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
      timeLimit: 40,
      wordLimit: 250,
      type: 'discuss_both_views'
    },
    {
      id: 'task2-2',
      title: 'Technology and Social Interaction',
      prompt: `In many countries, people are spending more time on digital devices and less time on face-to-face social interaction.

Do you think this is a positive or negative development?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
      timeLimit: 40,
      wordLimit: 250,
      type: 'opinion'
    },
    {
      id: 'task2-3',
      title: 'Environmental Protection',
      prompt: `Some people think that environmental problems should be solved on a global scale while others believe they should be dealt with nationally.

Discuss both views and give your opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
      timeLimit: 40,
      wordLimit: 250,
      type: 'discuss_both_views'
    },
    {
      id: 'task2-4',
      title: 'Work-Life Balance',
      prompt: `In some countries, the average working hours per week have increased significantly. Some people believe this trend improves economic productivity, while others argue it negatively affects people's quality of life.

What is your opinion on this issue?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
      timeLimit: 40,
      wordLimit: 250,
      type: 'opinion'
    }
  ]
};

export const speakingQuestions = {
  part1: [
    {
      topic: 'Work/Studies',
      questions: [
        "Do you work or are you a student?",
        "What subject are you studying?",
        "Why did you choose this subject?",
        "What do you find most interesting about your studies?",
        "What are your future career plans?"
      ]
    },
    {
      topic: 'Hometown',
      questions: [
        "Where are you from?",
        "What do you like most about your hometown?",
        "Has your hometown changed much since you were a child?",
        "Would you like to live somewhere else in the future?",
        "What would you recommend tourists visit in your hometown?"
      ]
    },
    {
      topic: 'Technology',
      questions: [
        "How often do you use technology in your daily life?",
        "What's your favorite piece of technology?",
        "How has technology changed the way people communicate?",
        "Do you think people rely too much on technology?",
        "What new technology would you like to learn about?"
      ]
    },
    {
      topic: 'Food',
      questions: [
        "What's your favorite type of food?",
        "Do you like cooking?",
        "What did you eat for breakfast this morning?",
        "How important is it to eat healthy food?",
        "Have your eating habits changed over the years?"
      ]
    }
  ],
  part2: [
    {
      id: 'part2-1',
      topic: 'Describe a place you have visited that you particularly enjoyed',
      cueCard: `Describe a place you have visited that you particularly enjoyed.

You should say:
• where it was
• when you went there  
• what you did there
• and explain why you enjoyed it

You have one minute to prepare. You can make notes if you wish.`,
      timeLimit: 2
    },
    {
      id: 'part2-2', 
      topic: 'Describe a skill you would like to learn',
      cueCard: `Describe a skill you would like to learn.

You should say:
• what the skill is
• why you want to learn it
• how you would learn it
• and explain how this skill would benefit you

You have one minute to prepare. You can make notes if you wish.`,
      timeLimit: 2
    },
    {
      id: 'part2-3',
      topic: 'Describe a memorable event from your childhood',
      cueCard: `Describe a memorable event from your childhood.

You should say:
• what the event was
• when and where it happened
• who was involved
• and explain why it was memorable for you

You have one minute to prepare. You can make notes if you wish.`,
      timeLimit: 2
    },
    {
      id: 'part2-4',
      topic: 'Describe a book that had a significant impact on you',
      cueCard: `Describe a book that had a significant impact on you.

You should say:
• what the book was about
• when you read it
• why you chose to read it
• and explain what impact it had on you

You have one minute to prepare. You can make notes if you wish.`,
      timeLimit: 2
    }
  ],
  part3: [
    {
      topic: 'Travel and Tourism',
      questions: [
        "How has tourism changed in your country over the past few decades?",
        "What are the positive and negative effects of tourism on local communities?",
        "Do you think people travel too much nowadays?",
        "How might travel change in the future?",
        "What can governments do to promote sustainable tourism?"
      ]
    },
    {
      topic: 'Education and Learning',
      questions: [
        "How important is formal education compared to life experience?",
        "What role should technology play in education?",
        "Do you think everyone should go to university?",
        "How has the way people learn changed over the years?",
        "What skills do you think will be most important in the future?"
      ]
    },
    {
      topic: 'Work and Career',
      questions: [
        "How has the nature of work changed in recent years?",
        "What factors should people consider when choosing a career?",
        "Do you think work-life balance is important?",
        "How might artificial intelligence affect employment in the future?",
        "What makes a good leader in the workplace?"
      ]
    }
  ]
};

export const readingPassages = [
  {
    id: 'reading-1',
    title: 'The Future of Renewable Energy',
    passage: `The transition to renewable energy sources represents one of the most significant technological and economic shifts of the 21st century. Solar and wind power, once considered alternative technologies, have now become mainstream solutions for electricity generation worldwide. This transformation has been driven by dramatic cost reductions, technological improvements, and growing environmental awareness.

The economics of renewable energy have fundamentally changed over the past decade. Solar photovoltaic costs have fallen by more than 85% since 2010, while onshore wind costs have decreased by approximately 70% over the same period. These price reductions have made renewable energy not just competitive with fossil fuels, but often cheaper in many markets. The levelized cost of electricity (LCOE) from utility-scale solar has dropped to as low as $0.048 per kilowatt-hour in some regions, compared to $0.378 in 2010.

Technological advancement has been a crucial factor in this cost reduction. Modern solar panels achieve efficiency rates of over 20%, compared to just 15% a decade ago. Wind turbines have grown larger and more sophisticated, with offshore installations now featuring turbines with rotor diameters exceeding 200 meters. Energy storage technology, particularly lithium-ion batteries, has also improved dramatically, with costs falling by 90% since 2010.

Government policies have provided additional momentum for renewable energy adoption. Feed-in tariffs, renewable energy certificates, and tax incentives have encouraged both individual and corporate investment in clean energy technologies. The European Union has committed to achieving carbon neutrality by 2050, while China has become the world's largest manufacturer of solar panels and wind turbines, driving down global costs through economies of scale.

However, significant challenges remain in the transition to renewable energy. The intermittent nature of solar and wind power requires substantial investment in energy storage and grid infrastructure. Current battery technology, while improving, still cannot economically store energy for extended periods. Grid systems designed for centralized fossil fuel power plants must be redesigned to accommodate distributed renewable generation.

Despite these challenges, the International Energy Agency projects that renewable energy will account for 95% of the increase in global power capacity through 2026. This growth is expected to be led by solar photovoltaics, which alone will account for more than half of renewable capacity additions. The transition represents not just an environmental imperative, but an economic opportunity that could create millions of jobs worldwide while reducing energy costs for consumers.`,
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        question: 'According to the passage, what has been the primary driver of renewable energy adoption?',
        options: [
          'Government regulations',
          'Environmental concerns', 
          'Cost reductions',
          'Technological improvements'
        ],
        correct: 2
      },
      {
        id: 2,
        type: 'true_false_not_given',
        question: 'Solar panel efficiency has increased by more than 50% in the past decade.',
        correct: 'FALSE'
      },
      {
        id: 3,
        type: 'fill_blank',
        question: 'The levelized cost of electricity from utility-scale solar has dropped to as low as $_____ per kilowatt-hour in some regions.',
        correct: '0.048'
      },
      {
        id: 4,
        type: 'multiple_choice',
        question: 'What is mentioned as a major challenge for renewable energy?',
        options: [
          'High manufacturing costs',
          'Lack of government support',
          'Intermittent power generation',
          'Limited technological advancement'
        ],
        correct: 2
      },
      {
        id: 5,
        type: 'multiple_choice',
        question: 'According to the International Energy Agency, renewable energy will account for what percentage of global power capacity increases through 2026?',
        options: [
          '85%',
          '90%',
          '95%',
          '100%'
        ],
        correct: 2
      }
    ]
  },
  {
    id: 'reading-2',
    title: 'The Psychology of Decision Making',
    passage: `Human decision-making is far more complex than traditional economic models suggest. While classical economics assumes that people make rational choices to maximize their utility, behavioral psychology reveals that our decisions are influenced by cognitive biases, emotions, and social factors that often lead to seemingly irrational behavior.

One of the most significant discoveries in behavioral economics is the concept of loss aversion, first identified by psychologists Daniel Kahneman and Amos Tversky. Their research demonstrated that people feel the pain of losing something approximately twice as strongly as they feel the pleasure of gaining the same thing. This asymmetry in how we perceive gains and losses has profound implications for everything from investment decisions to consumer behavior.

The availability heuristic is another cognitive bias that significantly affects decision-making. People tend to overestimate the likelihood of events that are easily recalled, often because they are recent, emotionally charged, or frequently reported in the media. For example, many people overestimate the risk of airplane crashes while underestimating the risk of car accidents, despite statistical evidence showing that flying is much safer than driving.

Anchoring bias occurs when people rely too heavily on the first piece of information they receive about a topic. In negotiations, the initial offer often serves as an anchor that influences the final agreement, even when the anchor is completely arbitrary. Real estate agents exploit this bias by showing expensive properties first, making subsequent properties seem more reasonably priced by comparison.

Social influences also play a crucial role in decision-making. The bandwagon effect describes our tendency to adopt beliefs or behaviors because many other people have done so. This can lead to market bubbles in finance, fashion trends in consumer goods, and even political movements. Social proof becomes particularly powerful when we are uncertain about the correct course of action.

Understanding these psychological factors has led to the development of "nudge theory," which suggests that small changes in how choices are presented can significantly influence behavior without restricting freedom of choice. For instance, making organ donation an opt-out rather than opt-in system dramatically increases donation rates. Similarly, automatically enrolling employees in retirement savings plans while allowing them to opt out results in much higher participation rates than requiring active enrollment.

The implications of behavioral economics extend beyond individual decision-making to public policy and business strategy. Governments use insights from behavioral psychology to design more effective policies, while companies apply these principles to improve customer experience and increase sales. As our understanding of human psychology continues to evolve, the gap between how we think we make decisions and how we actually make them becomes increasingly apparent.`,
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        question: 'According to the passage, loss aversion means that:',
        options: [
          'People prefer to avoid making any decisions involving risk',
          'People feel losses more strongly than equivalent gains',
          'People always choose the safest option available',
          'People cannot accurately assess potential losses'
        ],
        correct: 1
      },
      {
        id: 2,
        type: 'true_false_not_given',
        question: 'The availability heuristic causes people to overestimate risks that receive media attention.',
        correct: 'TRUE'
      },
      {
        id: 3,
        type: 'fill_blank',
        question: 'People feel the pain of losing something approximately _____ times as strongly as the pleasure of gaining the same thing.',
        correct: 'twice'
      },
      {
        id: 4,
        type: 'multiple_choice',
        question: 'What is "nudge theory"?',
        options: [
          'A method of forcing people to make better decisions',
          'A way to present choices that influences behavior without restricting freedom',
          'A technique for eliminating cognitive biases',
          'A system for predicting human behavior'
        ],
        correct: 1
      },
      {
        id: 5,
        type: 'true_false_not_given',
        question: 'Behavioral economics has no practical applications in business.',
        correct: 'FALSE'
      }
    ]
  }
];

export const listeningTests = [
  {
    id: 'listening-1',
    title: 'University Accommodation',
    audioUrl: 'https://example.com/audio/university-accommodation.mp3', // In real app, use actual audio files
    transcript: `
Receptionist: Good morning, University Accommodation Office. How can I help you?

Student: Hi, I'm calling about student accommodation for next year. I'm currently in my first year and I'm looking for something different.

Receptionist: Of course! What type of accommodation are you interested in?

Student: Well, I'm in a shared room in the halls at the moment, but I'd really like my own room next year. Privacy is quite important to me.

Receptionist: I understand. We have several options for single rooms. Are you interested in catered or self-catered accommodation?

Student: What's the difference in cost?

Receptionist: Self-catered is £120 per week, while catered accommodation is £165 per week. The catered option includes breakfast and dinner Monday to Friday, and brunch at weekends.

Student: That sounds quite expensive. What about shared houses?

Receptionist: We have some lovely shared houses available. These are typically for 4-6 students, and you'd have your own bedroom but share the kitchen and living areas. The cost is around £95 per week.

Student: That sounds more reasonable. Are they close to campus?

Receptionist: Most of our shared houses are within a 15-minute walk of the main campus, and all are on bus routes. Would you like me to send you some information?

Student: Yes, please. Also, when do I need to apply?

Receptionist: The deadline for applications is March 15th, and we'll notify successful applicants by April 30th. You'll need to pay a £200 deposit to secure your place.

Student: Perfect. Could you send the information to my university email address? It's j.smith@student.university.ac.uk.

Receptionist: Certainly. I'll send that over today. Is there anything else I can help you with?

Student: Just one more thing - are pets allowed in the shared houses?

Receptionist: I'm afraid not. Pets aren't permitted in any of our accommodation, except for registered assistance animals.

Student: Okay, thank you for your help.

Receptionist: You're welcome. Good luck with your application!
`,
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        question: 'What type of accommodation does the student currently have?',
        options: [
          'A single room in halls',
          'A shared room in halls', 
          'A shared house',
          'A private apartment'
        ],
        correct: 1
      },
      {
        id: 2,
        type: 'fill_blank',
        question: 'Self-catered accommodation costs £_____ per week.',
        correct: '120'
      },
      {
        id: 3,
        type: 'fill_blank',
        question: 'Shared houses typically accommodate _____ to _____ students.',
        correct: '4-6'
      },
      {
        id: 4,
        type: 'multiple_choice',
        question: 'When is the application deadline?',
        options: [
          'March 15th',
          'April 30th',
          'May 15th', 
          'June 1st'
        ],
        correct: 0
      },
      {
        id: 5,
        type: 'true_false_not_given',
        question: 'Pets are allowed in shared houses if they are registered assistance animals.',
        correct: 'TRUE'
      }
    ]
  }
];

export function getRandomWritingTask(taskType: 'task1' | 'task2') {
  const tasks = writingTasks[taskType];
  return tasks[Math.floor(Math.random() * tasks.length)];
}

export function getRandomSpeakingQuestions(part: 1 | 2 | 3) {
  const questions = speakingQuestions[`part${part}` as keyof typeof speakingQuestions];
  if (part === 1 || part === 3) {
    return questions[Math.floor(Math.random() * questions.length)];
  }
  return questions[Math.floor(Math.random() * questions.length)];
}

export function getRandomReadingPassage() {
  return readingPassages[Math.floor(Math.random() * readingPassages.length)];
}

export function getRandomListeningTest() {
  return listeningTests[Math.floor(Math.random() * listeningTests.length)];
}