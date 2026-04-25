"""
Quick test script to verify Gemini API is working
Run this to test if Gemini can parse transcripts
"""
import os
from dotenv import load_dotenv

load_dotenv()

def test_gemini():
    print("="*80)
    print("GEMINI API TEST")
    print("="*80)
    
    # Check API key
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not gemini_key:
        print("❌ ERROR: No GEMINI_API_KEY found in .env file")
        return False
    
    print(f"✓ API Key found: {gemini_key[:20]}...")
    
    # Test transcript
    test_transcript = """
    Team Meeting — April 2026
    Alex: Jordan, can you build the API by May 10th?
    Jordan: Sure. Taylor, I need designs first.
    Taylor: Designs ready May 5th.
    """
    
    print(f"\nTest transcript:")
    print(test_transcript)
    print("\nCalling Gemini API...")
    
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.output_parsers import JsonOutputParser
        from pydantic import BaseModel
        from typing import List
        
        class TaskItem(BaseModel):
            title: str
            description: str
            owner: str
            mentioned_deadline: str
            priority: int
            dependencies: List[str]
        
        class TaskList(BaseModel):
            tasks: List[TaskItem]
        
        gemini = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=gemini_key,
            temperature=0.1,
            request_timeout=15
        )
        
        parser = JsonOutputParser(pydantic_object=TaskList)
        prompt = f"""You are an expert project manager. Extract tasks from this transcript.
For each provide: title, description, owner (person's name), mentioned_deadline, priority (1-5), dependencies (list of task titles this depends on).
Return ONLY valid JSON matching the schema. Transcript:\n{test_transcript}\n{parser.get_format_instructions()}"""
        
        result_raw = gemini.invoke(prompt)
        result = parser.parse(result_raw.content)
        
        if result.get("tasks") and len(result["tasks"]) > 0:
            print(f"\n✓✓✓ SUCCESS! Gemini extracted {len(result['tasks'])} tasks")
            print(f"\nExtracted owners: {[t['owner'] for t in result['tasks']]}")
            print(f"Task titles: {[t['title'] for t in result['tasks']]}")
            print("\n" + "="*80)
            print("✓ GEMINI IS WORKING CORRECTLY")
            print("="*80)
            return True
        else:
            print("\n❌ ERROR: Gemini returned empty task list")
            return False
            
    except Exception as e:
        print(f"\n❌ ERROR: {type(e).__name__}: {str(e)}")
        print("\nPossible issues:")
        print("1. API key is invalid or expired")
        print("2. No internet connection")
        print("3. Gemini API quota exceeded")
        print("4. Missing dependencies (run: pip install langchain-google-genai)")
        return False

if __name__ == "__main__":
    success = test_gemini()
    if not success:
        print("\n⚠️  MissionControl will fall back to demo data")
        print("Check the issues above and try again")
