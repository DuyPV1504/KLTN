import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  ChevronLeft, BookOpen, CheckCircle, AlertCircle, Award, 
  Clock, Search, FilePlus, BookMarked, ArrowRight, Brain
} from "lucide-react";
import "../../styles/advice.css";

const Advice = () => {
  const navigate = useNavigate();

  const tfngTips = [
    {
      title: "Understand the difference between False and Not Given",
      description: "False statements directly contradict information in the passage. Not Given means there's insufficient information to determine if the statement is true or false. If the text doesn't mention the topic at all or doesn't provide enough detail, mark it as Not Given.",
      example: "Passage: 'The Great Barrier Reef, located off the coast of Queensland, Australia, is the world's largest coral reef system.' Statement: 'The Great Barrier Reef is in New Zealand.' This is False, as the text clearly states it's in Australia."
    },
    {
      title: "Read the statement carefully before finding evidence",
      description: "Analyze exactly what the statement claims before looking for evidence in the text. Pay attention to qualifiers like 'all', 'most', 'some', 'never', or 'always' which can change the meaning significantly.",
      example: "Statement: 'All scientists agree that climate change is accelerating.' If the text mentions 'most scientists' but not 'all scientists', this statement would be False, not True."
    },
    {
      title: "Watch out for paraphrasing and synonyms",
      description: "The statements rarely use identical wording to the passage. Look for synonyms, paraphrases, and different ways of expressing the same idea. Develop your vocabulary to recognize different ways of saying the same thing.",
      example: "Passage: 'The findings were inconclusive.' Statement: 'The research did not reach a definite conclusion.' These express the same idea using different words."
    },
    {
      title: "Be cautious with partial matches",
      description: "If only part of the statement matches the text, but other parts don't align or aren't mentioned, the statement may be False or Not Given. The entire statement must be supported by the text to be marked as True.",
      example: "Passage: 'The program was successful in urban areas.' Statement: 'The program was successful everywhere.' This would be False because the text limits success to urban areas only."
    },
    {
      title: "Don't use background knowledge",
      description: "Base your answers solely on the information given in the passage, not on your prior knowledge of the subject. Even if you know something to be true in real life, if it's not supported by the text, it's Not Given.",
      example: "If the passage discusses Albert Einstein but doesn't mention his Nobel Prize, a statement about him winning the Nobel Prize would be Not Given, even though this is a well-known fact."
    },
    {
      title: "Identify qualifying language",
      description: "Be alert to qualifying words in both the passage and statements (might, could, sometimes, often, generally, etc.). These can change the certainty of a claim and affect whether it's True, False, or Not Given.",
      example: "Passage: 'Coffee consumption might increase alertness.' Statement: 'Coffee definitely increases alertness.' This would be False because the passage expresses possibility, not certainty."
    }
  ];

  const ynngTips = [
    {
      title: "Focus on the writer's claims and opinions",
      description: "Yes/No/Not Given questions focus specifically on the writer's views, claims, or opinions—not just factual information. Look for language that indicates the writer's perspective or stance on a topic.",
      example: "Passage: 'I believe the government's approach is flawed.' Statement: 'The writer thinks the government's approach has problems.' This would be Yes, as it reflects the writer's stated opinion."
    },
    {
      title: "Identify opinion signals in the text",
      description: "Look for phrases that signal opinions: 'I believe', 'in my view', 'it seems that', 'evidently', 'clearly', 'without doubt', 'it is reasonable to assume', etc. These help identify what the writer truly believes.",
      example: "Passage: 'In my view, renewable energy represents the future of sustainable development.' This clearly signals the writer's opinion about renewable energy."
    },
    {
      title: "Distinguish between facts and opinions",
      description: "Yes/No/Not Given questions specifically test the writer's opinions, not factual statements. The writer may present facts without endorsing them or expressing an opinion about them.",
      example: "Passage: 'Studies show coral reefs are declining. This trend is alarming and requires immediate action.' The first sentence states a fact; the second expresses the writer's opinion."
    },
    {
      title: "Consider strength of claim in the question",
      description: "Pay attention to how strongly a view is expressed in both the passage and the question. If the passage shows mild support but the question states strong endorsement, they may not match.",
      example: "Passage: 'Electric cars might help reduce emissions somewhat.' Statement: 'The writer strongly advocates for electric cars as the solution to emissions.' This would be No, as the writer's support is qualified and tentative."
    },
    {
      title: "Look for reported opinions vs. writer's opinions",
      description: "The writer may report other people's opinions without agreeing with them. Ensure you're identifying the writer's own views, not just views they're describing.",
      example: "Passage: 'Many scientists believe AI poses existential risks, though this seems exaggerated to me.' Statement: 'The writer thinks AI is an existential threat.' This would be No, as the writer actually disagrees with this view."
    },
    {
      title: "Be careful with partial opinions",
      description: "The writer might agree with part of a statement but not all of it. If the question statement combines elements the writer agrees and disagrees with, the answer may be No.",
      example: "Passage: 'While genetic modification offers benefits for crop yield, its environmental impacts are concerning.' Statement: 'The writer believes genetic modification is beneficial without drawbacks.' This would be No."
    }
  ];

  const generalTips = [
    {
      title: "Time management is critical",
      description: "Allocate your time strategically across all sections. For TFNG/YNNG questions, spend about 20 minutes on each passage (about 1-1.5 minutes per question). If stuck on a question, mark it and return later.",
      icon: <Clock className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Master skimming and scanning techniques",
      description: "Use skimming (quickly reading for general meaning) to understand the passage's structure. Use scanning (searching for specific information) to locate relevant details for each statement. Practice both techniques regularly.",
      icon: <Search className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Follow the passage order",
      description: "IELTS questions typically follow the order of information in the passage. After answering one question, you can usually continue reading from that point rather than starting from the beginning for each question.",
      icon: <ArrowRight className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Improve vocabulary through active reading",
      description: "Regularly read articles from publications like The Economist, Scientific American, or National Geographic. Note unfamiliar words and their synonyms. Building vocabulary helps you recognize paraphrased content.",
      icon: <BookMarked className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Create your own practice questions",
      description: "After reading an article, try writing your own TFNG/YNNG questions. This develops your understanding of how these questions are constructed and improves your ability to identify answer patterns.",
      icon: <FilePlus className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Learn from mistakes systematically",
      description: "Keep a log of questions you answer incorrectly. Analyze why you got them wrong and look for patterns in your mistakes. This targeted approach helps you address specific weaknesses.",
      icon: <Brain className="w-5 h-5 text-blue-600" />
    }
  ];

  return (
    <div className="advice-container">
      <div className="advice-content">
        {/* Back button and header */}
        <div className="advice-header">
          <Button 
            className="back-button"
            onClick={() => navigate('/user')}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <h1 className="page-title">IELTS Reading Advice & Tips</h1>
        </div>

        {/* Introduction */}
        <div className="advice-card">
          <div className="card-header">
            <BookOpen className="card-icon text-blue-600" />
            <h2 className="card-title">Mastering IELTS Reading</h2>
          </div>
          
          <p className="card-text">
            The IELTS Reading section challenges your ability to understand main ideas, details, opinions, and attitudes expressed in texts. 
            One of the most challenging question types is True/False/Not Given (for factual information) and Yes/No/Not Given (for opinions and claims).
          </p>
          
          <p className="card-text">
            These question types test whether you can identify:
          </p>
          
          <ul className="feature-list">
            <li><strong>True/Yes</strong> - Information/opinion that matches the passage</li>
            <li><strong>False/No</strong> - Information/opinion that contradicts the passage</li>
            <li><strong>Not Given</strong> - Information/opinion not found in the passage</li>
          </ul>
          
          <div className="flex gap-4 mt-6 flex-wrap">
            <Button 
              className="cta-button"
              onClick={() => navigate('/practice')}
            >
              Practice Now
            </Button>
            <Button 
              className="px-6 py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
              onClick={() => window.open('https://www.ielts.org/for-test-takers/test-format', '_blank')}
            >
              Official IELTS Resources
            </Button>
          </div>
        </div>

        {/* True/False/Not Given Tips */}
        <div className="advice-card">
          <div className="card-header">
            <CheckCircle className="card-icon text-green-600" />
            <h2 className="card-title">True/False/Not Given Tips</h2>
          </div>
          
          <div className="tips-grid">
            {tfngTips.map((tip, index) => (
              <div key={index} className="tip-item tfng-tip">
                <h3 className="tip-title">{tip.title}</h3>
                <p className="tip-description">{tip.description}</p>
                {tip.example && (
                  <div className="tip-example">
                    <p className="example-label">Example:</p>
                    <p className="example-text">{tip.example}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Yes/No/Not Given Tips */}
        <div className="advice-card">
          <div className="card-header">
            <AlertCircle className="card-icon text-orange-600" />
            <h2 className="card-title">Yes/No/Not Given Tips</h2>
          </div>
          
          <div className="tips-grid">
            {ynngTips.map((tip, index) => (
              <div key={index} className="tip-item ynng-tip">
                <h3 className="tip-title">{tip.title}</h3>
                <p className="tip-description">{tip.description}</p>
                {tip.example && (
                  <div className="tip-example ynng-example">
                    <p className="example-label">Example:</p>
                    <p className="example-text">{tip.example}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* General Reading Tips */}
        <div className="advice-card">
          <div className="card-header">
            <Award className="card-icon text-blue-600" />
            <h2 className="card-title">General Reading Strategies</h2>
          </div>
          
          <div className="tips-grid general-tips-grid">
            {generalTips.map((tip, index) => (
              <div key={index} className="tip-item general-tip">
                <div className="tip-icon">{tip.icon}</div>
                <div className="tip-content">
                  <h3 className="tip-title">{tip.title}</h3>
                  <p className="tip-description">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cta-box">
            <h3 className="cta-title">Ready to improve your score?</h3>
            <p className="cta-text">
              Consistent practice is the key to mastering IELTS Reading. Use our practice tool regularly to 
              apply these tips and track your improvement over time. Remember that the more you practice,
              the more familiar you'll become with these question types.
            </p>
            <Button 
              className="cta-button"
              onClick={() => navigate('/practice')}
            >
              Start Practicing Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advice;